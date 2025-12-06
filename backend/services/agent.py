from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from azure.identity import ClientSecretCredential
from azure.ai.projects import AIProjectClient
import textwrap
import time
import os
import sys
import json
from datetime import datetime
from typing import Dict, List, Optional
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
        
        # Initialize conversation storage (in-memory for now)
        self.conversations: Dict[str, Dict] = {}
        logger.info("Conversation storage initialized")

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

    def generate_conversation_title(self, first_message: str) -> str:
        """
        Generate a conversation title based on the first user message using the Azure agent
        """
        logger.info(f"Generating conversation title for message: '{first_message[:50]}...'")
        try:
            # Create a temporary thread for title generation
            thread = self.project.agents.threads.create()
            
            # Create a prompt for title generation
            title_prompt = f"""Generate a short, concise title (maximum 5-7 words) for a conversation that starts with this question:

"{first_message}"

Respond with ONLY the title, nothing else. No quotes, no explanations."""
            
            self.project.agents.messages.create(
                thread_id=thread.id,
                role="user",
                content=title_prompt
            )
            
            # Run the agent
            run = self.project.agents.runs.create_and_process(
                thread_id=thread.id,
                agent_id=self.agent_id
            )
            
            # Poll for completion
            poll_count = 0
            while poll_count < 30:  # Max 30 seconds
                poll_count += 1
                response = self.project.agents.runs.get(
                    thread_id=thread.id,
                    run_id=run.id
                )
                if response.status in ("completed", "failed", "cancelled", "expired"):
                    break
                time.sleep(1)
            
            # Get the title if completed
            if response.status == "completed":
                messages = list(self.project.agents.messages.list(thread_id=thread.id))
                for msg in messages:
                    if msg.role == "assistant":
                        title = msg.content[0].text.value.strip()
                        # Remove quotes if present
                        title = title.strip('"').strip("'")
                        logger.info(f"Generated title: '{title}'")
                        return title
            
            # Fallback to a default title
            fallback_title = f"Chat about {first_message[:30]}..."
            logger.warning(f"Using fallback title: '{fallback_title}'")
            return fallback_title
            
        except Exception as e:
            logger.error(f"Error generating conversation title: {e}", exc_info=True)
            return f"New Conversation"

    def generate_answer(self, query, matches, thread_id: Optional[str] = None):
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

            # Use existing thread or create a new one
            if thread_id and thread_id in self.conversations:
                logger.info(f"Using existing thread: {thread_id}")
                print(f"Using existing thread: {thread_id}")
                # Retrieve the thread object (we'll use the stored thread_id)
                class ThreadObj:
                    def __init__(self, tid):
                        self.id = tid
                thread = ThreadObj(thread_id)
            else:
                logger.info("Creating new Azure thread...")
                thread = self.project.agents.threads.create()
                logger.info(f"Thread created: {thread.id}")
                print(f"Thread created: {thread.id}")
                
                # Initialize conversation storage
                self.conversations[thread.id] = {
                    "thread_id": thread.id,
                    "title": None,  # Will be set later
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat(),
                    "messages": []
                }
            
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
                        
                        # Store the conversation
                        if thread.id in self.conversations:
                            # Add user message
                            self.conversations[thread.id]["messages"].append({
                                "role": "user",
                                "content": query,
                                "timestamp": datetime.now().isoformat(),
                                "sources": None
                            })
                            
                            # Add assistant message
                            sources_info = [{
                                "source": match['metadata']['source'],
                                "chunk_text": match['metadata']['chunk_text'][:200] + "...",
                                "chunk_index": match['metadata']['chunk_index']
                            } for match in matches]
                            
                            self.conversations[thread.id]["messages"].append({
                                "role": "assistant",
                                "content": answer,
                                "timestamp": datetime.now().isoformat(),
                                "sources": sources_info
                            })
                            
                            # Update timestamp
                            self.conversations[thread.id]["updated_at"] = datetime.now().isoformat()
                            
                            logger.info(f"Conversation updated: {thread.id}")
                        
                        return answer, thread.id
                        
                logger.warning("No assistant message found in thread")
                return "No response from agent.", thread.id
            else:
                error_msg = f"Agent run {status}. Please try again."
                logger.error(error_msg)
                return error_msg, thread.id
                
        except Exception as e:
            logger.error(f"Error generating answer: {e}", exc_info=True)
            raise

    def get_conversations(self) -> List[Dict]:
        """
        Get all conversations with their metadata
        """
        logger.info(f"Retrieving all conversations (count: {len(self.conversations)})")
        conversations = []
        for thread_id, conv in self.conversations.items():
            conversations.append({
                "thread_id": thread_id,
                "title": conv.get("title", "Untitled Conversation"),
                "created_at": conv.get("created_at"),
                "updated_at": conv.get("updated_at"),
                "message_count": len(conv.get("messages", []))
            })
        # Sort by updated_at descending
        conversations.sort(key=lambda x: x["updated_at"], reverse=True)
        return conversations

    def get_conversation(self, thread_id: str) -> Optional[Dict]:
        """
        Get a specific conversation by thread_id
        """
        logger.info(f"Retrieving conversation: {thread_id}")
        if thread_id not in self.conversations:
            logger.warning(f"Conversation not found: {thread_id}")
            return None
        
        conv = self.conversations[thread_id]
        return {
            "thread_id": thread_id,
            "title": conv.get("title", "Untitled Conversation"),
            "created_at": conv.get("created_at"),
            "updated_at": conv.get("updated_at"),
            "messages": conv.get("messages", [])
        }

    def delete_conversation(self, thread_id: str) -> bool:
        """
        Delete a conversation by thread_id
        """
        logger.info(f"Deleting conversation: {thread_id}")
        if thread_id in self.conversations:
            del self.conversations[thread_id]
            logger.info(f"Conversation deleted: {thread_id}")
            return True
        logger.warning(f"Conversation not found for deletion: {thread_id}")
        return False

    def update_conversation_title(self, thread_id: str, title: str) -> bool:
        """
        Update the title of a conversation
        """
        logger.info(f"Updating title for conversation {thread_id}: '{title}'")
        if thread_id in self.conversations:
            self.conversations[thread_id]["title"] = title
            self.conversations[thread_id]["updated_at"] = datetime.now().isoformat()
            logger.info(f"Title updated successfully")
            return True
        logger.warning(f"Conversation not found for title update: {thread_id}")
        return False

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
