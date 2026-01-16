import sys
import os

# Add the project root to the python path so imports work correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pinecone import Pinecone, ServerlessSpec
import time
from core.config import *

def setup_pinecone():
    print("Initializing Pinecone...")
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Check if index exists
    existing_indexes = [index.name for index in pc.list_indexes()]
    
    if INDEX_NAME in existing_indexes:
        print(f"Index '{INDEX_NAME}' already exists. Using existing index.")
        # We do NOT delete it anymore, just use it.
        return pc.Index(INDEX_NAME)

    print(f"Creating new index: {INDEX_NAME}...")
    # Standard Index for 384-dimension vectors (all-MiniLM-L6-v2)
    pc.create_index(
        name=INDEX_NAME,
        dimension=384, 
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )
    print("Index creating... waiting for it to be ready.")
    while not pc.describe_index(INDEX_NAME).status['ready']:
        time.sleep(1)
    print("Index is ready!")

    return pc.Index(INDEX_NAME)

if __name__ == "__main__":
    setup_pinecone()
