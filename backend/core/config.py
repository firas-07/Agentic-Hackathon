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

# Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# Embedding Model
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
