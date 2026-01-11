import os
from dotenv import load_dotenv

from pathlib import Path

# Load environment variables from global .env file
# config.py is in Backend/core/, so we go up 3 levels to find root .env
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

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

# Jira Configuration
JIRA_BASE_URL = os.getenv("JIRA_BASE_URL")
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")
JIRA_PROJECT_KEY = os.getenv("JIRA_PROJECT_KEY")

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30