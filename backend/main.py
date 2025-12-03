from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import *
from services.knowledge_base import KnowledgeBase
from services.agent import Agent
from routers import chat, knowledge_base, health

app = FastAPI(
    title="Agentic RAG System API",
    description="Chat with Knowledge Base - Intelligent Support Assistant for Confluence Documentation",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
kb = None
agent = None

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global kb, agent
    try:
        # 1. Setup database (remove previous index and create new one)
        print("🗂️ Setting up database...")
        from scripts.setup_db import setup_pinecone
        index = setup_pinecone()
        print("✅ Database setup complete")
        
        # 2. Run pipeline to ingest data
        print("📥 Running data ingestion pipeline...")
        from src.pipeline import KnowledgeBase
        pipeline_kb = KnowledgeBase()
        pipeline_kb.run_pipeline()
        print("✅ Data ingestion complete")
        
        # 3. Initialize services
        print("🚀 Initializing services...")
        kb = KnowledgeBase()
        agent = Agent()
        
        # Set instances in routers
        chat.set_agent_instance(agent)
        knowledge_base.set_kb_instance(kb)
        health.set_instances(kb, agent)
        
        print("✅ Services initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize services: {e}")
        raise e

# Include routers
app.include_router(health.router, prefix="/api")
app.include_router(knowledge_base.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
