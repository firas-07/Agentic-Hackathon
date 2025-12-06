from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from azure.identity import ClientSecretCredential
from azure.ai.projects import AIProjectClient
import textwrap
import time
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from core.config import *
from core.logger import setup_logger

logger = setup_logger('agent')

class Agent:
    def __init__(self):
        logger.info("Initializing Agent...")
        
        # 1. Initialize Pinecone
        logger.info("Connecting to Pinecone...")
        try:
            self.pc = Pinecone(api_key=PINECONE_API_KEY)
            self.index = self.pc.Index(INDEX_NAME)
            logger.info(f"Successfully connected to Pinecone index: {INDEX_NAME}")
        except Exception as e:
            logger.error(f"Failed to connect to Pinecone: {e}", exc_info=True)
            raise
        
        # 2. Initialize Embedding Model (Local)
        logger.info("Loading embedding model...")
        print("Loading embedding model...")
        try:
            # Try using huggingface_hub directly to download
            from huggingface_hub import hf_hub_download, snapshot_download
            cache_dir = "./models_cache"
            os.makedirs(cache_dir, exist_ok=True)
            
            # Download the model snapshot first
            model_path = snapshot_download(
                repo_id="sentence-transformers/all-MiniLM-L6-v2",
                cache_dir=cache_dir,
                local_files_only=False
            )
            print(f"Model downloaded to: {model_path}")
            
            # Now load the model from the local path
            self.embed_model = SentenceTransformer(model_path)
            logger.info(f"Embedding model loaded successfully from: {model_path}")
            print("Model loaded successfully!")
            
        except Exception as e:
            logger.warning(f"Error with HuggingFace approach: {e}")
            print(f"Error with HuggingFace approach: {e}")
            logger.info("Using simple TF-IDF as fallback...")
            print("Using simple TF-IDF as fallback...")
            # Use sklearn's TfidfVectorizer as a simple fallback
            from sklearn.feature_extraction.text import TfidfVectorizer
            import numpy as np
            
            class SimpleEmbedder:
                def __init__(self):
                    self.vectorizer = TfidfVectorizer(max_features=384)  # Match embedding dimension
                    self._fitted = False
                
                def encode(self, texts):
                    if isinstance(texts, str):
                        texts = [texts]
                    if not self._fitted:
                        embeddings = self.vectorizer.fit_transform(texts).toarray()
                        self._fitted = True
                    else:
                        embeddings = self.vectorizer.transform(texts).toarray()
                    
                    # Ensure we have exactly 384 dimensions
                    if embeddings.shape[1] < 384:
                        # Pad with zeros if needed
                        padding = 384 - embeddings.shape[1]
                        embeddings = np.pad(embeddings, ((0, 0), (0, padding)), 'constant')
                    return embeddings
                
                def __call__(self, texts):
                    return self.encode(texts)
            
            self.embed_model = SimpleEmbedder()
            logger.info("Fallback TF-IDF embedder initialized")
        
        # 3. Initialize Azure AI Projects Client
        logger.info("Initializing Azure AI Projects Client...")
        try:
            # Authenticate using Azure AD
            self.credential = ClientSecretCredential(
                tenant_id=TENANT_ID,
                client_id=CLIENT_ID,
                client_secret=CLIENT_SECRET
            )
            logger.info("Azure credentials created successfully")
            
            # Initialize Azure AI Project Client
            self.project = AIProjectClient(
                credential=self.credential,
                endpoint=PROJECT_ENDPOINT
            )
            logger.info(f"Azure AI Project Client initialized with endpoint: {PROJECT_ENDPOINT}")
            
            self.agent_id = AZURE_AGENT_ID
            logger.info(f"Using Agent ID: {self.agent_id}")
            print(f"Azure AI Project Client initialized")
            print(f"Using Agent ID: {self.agent_id}")
        except Exception as e:
            logger.error(f"Failed to initialize Azure client: {e}", exc_info=True)
            raise

    def search_knowledge_base(self, query, top_k=3):
        """
        Searches Pinecone for the most relevant chunks of text.
        """
        logger.info(f"Searching knowledge base for query: '{query}' (top_k={top_k})")
        try:
            # Convert query to vector
            query_vector = self.embed_model.encode(query).tolist()
            logger.debug(f"Query vector generated with dimension: {len(query_vector)}")
            
            # Search Pinecone
            results = self.index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True
            )
            
            matches = results['matches']
            logger.info(f"Found {len(matches)} matches from Pinecone")
            for i, match in enumerate(matches):
                logger.debug(f"Match {i+1}: Score={match.get('score', 'N/A')}, Source={match.get('metadata', {}).get('source', 'Unknown')}")
            
            return matches
        except Exception as e:
            logger.error(f"Error searching knowledge base: {e}", exc_info=True)
            raise

    def generate_answer(self, query, matches):
        """
        Generate answer using Azure AI Foundry Agent based on retrieved context
        """
        logger.info(f"Generating answer for query: '{query}'")
        try:
            # Prepare context string
            context_text = ""
            for i, match in enumerate(matches):
                source = match['metadata']['source']
                text = match['metadata']['chunk_text']
                context_text += f"\nSource: {source}\nContent: {text}\n"
                logger.debug(f"Context {i+1}: {source} - {text[:100]}...")

            # Create a new thread
            logger.info("Creating new Azure thread...")
            thread = self.project.agents.threads.create()
            logger.info(f"Thread created: {thread.id}")
            print(f"Thread created: {thread.id}")
            
            # Add user message with context
            user_message = f"""Use the following context from the company's documentation to answer the user's question.
If the answer is not in the context, say you don't know.

Context:
{context_text}

User Question: {query}"""
            
            logger.debug(f"User message prepared (length: {len(user_message)} chars)")
            
            self.project.agents.messages.create(
                thread_id=thread.id,
                role="user",
                content=user_message
            )
            logger.info("User message added to thread")
            
            # Run the agent
            logger.info(f"Starting agent run with agent_id: {self.agent_id}")
            run = self.project.agents.runs.create_and_process(
                thread_id=thread.id,
                agent_id=self.agent_id
            )
            logger.info(f"Run started: {run.id}")
            print(f"Run started: {run.id}")
            
            # Poll for completion
            poll_count = 0
            while True:
                poll_count += 1
                response = self.project.agents.runs.get(
                    thread_id=thread.id,
                    run_id=run.id
                )
                status = response.status
                logger.debug(f"Poll {poll_count}: Run status = {status}")
                print(f"Run status: {status}")
                
                if status in ("completed", "failed", "cancelled", "expired"):
                    logger.info(f"Run finished with status: {status}")
                    break
                time.sleep(1)
            
            # Get the response if completed
            if status == "completed":
                logger.info("Fetching assistant response...")
                messages = list(self.project.agents.messages.list(thread_id=thread.id))
                logger.debug(f"Retrieved {len(messages)} messages from thread")
                
                for msg in messages:
                    if msg.role == "assistant":
                        answer = msg.content[0].text.value
                        logger.info(f"Assistant response received (length: {len(answer)} chars)")
                        logger.debug(f"Assistant response: {answer[:200]}...")
                        return answer
                        
                logger.warning("No assistant message found in thread")
                return "No response from agent."
            else:
                error_msg = f"Agent run {status}. Please try again."
                logger.error(error_msg)
                return error_msg
                
        except Exception as e:
            logger.error(f"Error generating answer: {e}", exc_info=True)
            raise

    def ask(self, query):
        print(f"\nUser Question: {query}")
        print("Searching knowledge base...")
        
        # 1. Retrieve relevant context
        matches = self.search_knowledge_base(query)
        
        if not matches:
            return "I couldn't find any information about that in the knowledge base."

        # 2. Generate Answer with Azure AI Agent
        answer = self.generate_answer(query, matches)
        
        print("\n=== FINAL ANSWER ===")
        print(textwrap.fill(answer, width=80))
        return answer
