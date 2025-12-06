import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---

EMAIL = os.getenv("EMAIL")
API_TOKEN = os.getenv("API_TOKEN")
DOMAIN = os.getenv("DOMAIN")

# Confluence Page IDs (Comma separated in env)
_page_ids_str = os.getenv("PAGE_IDS", "")
PAGE_IDS = [pid.strip() for pid in _page_ids_str.split(",") if pid.strip()]

# Pinecone
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME", "agentic-hackathon-index")

# Azure AI Foundry Agent Configuration
PROJECT_ENDPOINT = os.getenv("PROJECT_ENDPOINT")
AZURE_AGENT_ID = os.getenv("AZURE_AGENT_ID")
AZURE_THREAD_ID = os.getenv("AZURE_THREAD_ID")  # Optional: default thread for testing
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
TENANT_ID = os.getenv("TENANT_ID")
AZURE_MODEL_NAME = os.getenv("AZURE_MODEL_NAME", "gpt-4o-mini")

# Embedding Model
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")