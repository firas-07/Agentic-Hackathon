from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from google import genai
import textwrap
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from core.config import *

class Agent:
    def __init__(self):
        # 1. Initialize Pinecone
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        self.index = self.pc.Index(INDEX_NAME)
        
        # 2. Initialize Embedding Model (Local)
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
            print("Model loaded successfully!")
            
        except Exception as e:
            print(f"Error with HuggingFace approach: {e}")
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
        
        # 3. Initialize Gemini
        self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)

    def search_knowledge_base(self, query, top_k=3):
        """
        Searches Pinecone for the most relevant chunks of text.
        """
        # Convert query to vector
        query_vector = self.embed_model.encode(query).tolist()
        
        # Search Pinecone
        results = self.index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True
        )
        
        return results['matches']

    def generate_answer(self, query, matches):
        """
        Generate answer using Gemini based on retrieved context
        """
        # Prepare context string
        context_text = ""
        for match in matches:
            source = match['metadata']['source']
            text = match['metadata']['chunk_text']
            context_text += f"\nSource: {source}\nContent: {text}\n"

        # Generate Answer with Gemini
        prompt = f"""
        You are a helpful assistant for a business application.
        Use the following context from the company's documentation to answer the user's question.
        If the answer is not in the context, say you don't know.
        
        Context:
        {context_text}
        
        User Question: {query}
        
        Answer:
        """
        
        response = self.gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )
        
        return response.text

    def ask(self, query):
        print(f"\nUser Question: {query}")
        print("Searching knowledge base...")
        
        # 1. Retrieve relevant context
        matches = self.search_knowledge_base(query)
        
        if not matches:
            return "I couldn't find any information about that in the knowledge base."

        # 2. Generate Answer with Gemini
        answer = self.generate_answer(query, matches)
        
        print("\n=== FINAL ANSWER ===")
        print(textwrap.fill(answer, width=80))
        return answer
