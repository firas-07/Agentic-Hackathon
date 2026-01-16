from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import *
from core.logger import setup_logger
from services.knowledge_base import KnowledgeBase
from services.agent import Agent
from routers import chat, knowledge_base, health, auth

logger = setup_logger('main')

app = FastAPI(
    title="Agentic AI Assistant API",
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
    logger.info("="*60)
    logger.info("Starting Agentic AI Assistant API")
    logger.info("="*60)
    
    try:
        # 1. Setup database (Safe check - RE-ENABLED for user preference)
        # The user WANTS to delete and create new index every time as per request "everytime i need delete old index and create new one"
        # This implies they rely on a fresh state to ensure data integrity/extraction works.
        logger.info("[SETUP] Setting up database...")
        print("🗂️ Setting up database...")
        from scripts.setup_db import setup_pinecone
        index = setup_pinecone()
        logger.info("[SETUP] Database setup complete")
        print("✅ Database setup complete")
        
        # 2. Run pipeline to ingest data (RE-ENABLED)
        logger.info("[INGESTION] Running data ingestion pipeline...")
        print("📥 Running data ingestion pipeline...")
        from core.pipeline import KnowledgeBase
        pipeline_kb = KnowledgeBase()
        pipeline_kb.run_pipeline()
        logger.info("[INGESTION] Data ingestion complete")
        print("✅ Data ingestion complete")
        
        # 3. Initialize services
        logger.info("[INIT] Initializing services...")
        print("🚀 Initializing services...")
        kb = KnowledgeBase()
        agent = Agent()
        
        # Set instances in routers
        chat.set_agent_instance(agent)
        knowledge_base.set_kb_instance(kb)
        health.set_instances(kb, agent)
        
        logger.info("[SUCCESS] Services initialized successfully")
        logger.info("API is ready to accept requests")
        print("✅ Services initialized successfully")
    except Exception as e:
        logger.error(f"[ERROR] Failed to initialize services: {e}", exc_info=True)
        print(f"❌ Failed to initialize services: {e}")
        raise e

# Include routers
app.include_router(health.router, prefix="/api")
app.include_router(knowledge_base.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
