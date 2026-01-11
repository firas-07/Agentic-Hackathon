from fastapi import APIRouter, HTTPException
from typing import List
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from core.config import *
from core.logger import setup_logger
from services.agent import Agent
from models.schemas import (
    QueryRequest, QueryResponse, 
    ConversationListResponse, ConversationDetail,
    CreateConversationResponse, Conversation
)

logger = setup_logger('chat_router')
router = APIRouter()

# Global agent instance
agent = None

def set_agent_instance(agent_instance):
    """Set the global agent instance"""
    global agent
    agent = agent_instance

@router.post("/chat", response_model=QueryResponse, tags=["Chat"])
async def chat_with_knowledge_base(request: QueryRequest):
    """Chat with the knowledge base with a natural language question"""
    logger.info(f"=== New Chat Request ===")
    logger.info(f"Query: '{request.query}'")
    logger.info(f"Thread ID: {request.thread_id}")
    logger.info(f"Top K: {request.top_k}")
    
    try:
        if not agent:
            logger.error("Agent not initialized")
            raise Exception("Agent not initialized")
        
        logger.info("Searching knowledge base...")
        # Search knowledge base
        matches = agent.search_knowledge_base(request.query, request.top_k)
        
        if not matches:
            logger.warning("No matches found in knowledge base")
            # Still create/use thread even with no matches
            if request.thread_id:
                thread_id = request.thread_id
            else:
                # Create a minimal thread entry
                from datetime import datetime
                import uuid
                thread_id = f"thread_{uuid.uuid4().hex[:16]}"
                agent.conversations[thread_id] = {
                    "thread_id": thread_id,
                    "title": None,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat(),
                    "messages": []
                }
            
            return QueryResponse(
                answer="I couldn't find any information about that in the knowledge base.",
                thread_id=thread_id,
                conversation_title="New Conversation",
                sources=[],
                confidence_scores=[]
            )
        
        logger.info(f"Found {len(matches)} matches, generating answer...")
        # Generate answer with thread support
        answer, thread_id, used_matches = agent.generate_answer(request.query, matches, request.thread_id)
        
        # Generate conversation title if this is a new conversation
        conversation_title = "New Conversation"
        if thread_id in agent.conversations:
            if not agent.conversations[thread_id].get("title"):
                # Generate title from first message
                conversation_title = agent.generate_conversation_title(request.query)
                agent.update_conversation_title(thread_id, conversation_title)
            else:
                conversation_title = agent.conversations[thread_id].get("title") or "New Conversation"
        
        # Extract sources and scores
        sources = []
        confidence_scores = []
        
        seen_sources = set()
        
        for match in used_matches:
            source_name = match['metadata']['source']
            if source_name not in seen_sources:
                sources.append({
                    "source": source_name,
                    "chunk_text": match['metadata']['chunk_text'][:200] + "...",
                    "chunk_index": match['metadata']['chunk_index']
                })
                confidence_scores.append(match['score'])
                seen_sources.add(source_name)
        
        logger.info(f"Successfully generated answer (length: {len(answer)} chars)")
        logger.info(f"Thread ID: {thread_id}, Title: {conversation_title}")
        logger.info(f"Returning {len(sources)} sources with confidence scores: {confidence_scores}")
        
        return QueryResponse(
            answer=answer,
            thread_id=thread_id,
            conversation_title=conversation_title,
            sources=sources,
            confidence_scores=confidence_scores
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.get("/conversations", response_model=ConversationListResponse, tags=["Conversations"])
async def get_all_conversations():
    """Get all conversations with their metadata"""
    logger.info("=== Get All Conversations Request ===")
    
    try:
        if not agent:
            logger.error("Agent not initialized")
            raise Exception("Agent not initialized")
        
        conversations = agent.get_conversations()
        logger.info(f"Retrieved {len(conversations)} conversations")
        
        return ConversationListResponse(conversations=conversations)
        
    except Exception as e:
        logger.error(f"Get conversations error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get conversations: {str(e)}")

@router.get("/conversations/{thread_id}", response_model=ConversationDetail, tags=["Conversations"])
async def get_conversation(thread_id: str):
    """Get a specific conversation by thread ID"""
    logger.info(f"=== Get Conversation Request: {thread_id} ===")
    
    try:
        if not agent:
            logger.error("Agent not initialized")
            raise Exception("Agent not initialized")
        
        conversation = agent.get_conversation(thread_id)
        
        if not conversation:
            logger.warning(f"Conversation not found: {thread_id}")
            raise HTTPException(status_code=404, detail=f"Conversation not found: {thread_id}")
        
        logger.info(f"Retrieved conversation: {thread_id}")
        return ConversationDetail(**conversation)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get conversation: {str(e)}")

@router.delete("/conversations/{thread_id}", tags=["Conversations"])
async def delete_conversation(thread_id: str):
    """Delete a conversation by thread ID"""
    logger.info(f"=== Delete Conversation Request: {thread_id} ===")
    
    try:
        if not agent:
            logger.error("Agent not initialized")
            raise Exception("Agent not initialized")
        
        success = agent.delete_conversation(thread_id)
        
        if not success:
            logger.warning(f"Conversation not found for deletion: {thread_id}")
            raise HTTPException(status_code=404, detail=f"Conversation not found: {thread_id}")
        
        logger.info(f"Conversation deleted: {thread_id}")
        return {"message": f"Conversation {thread_id} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete conversation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to delete conversation: {str(e)}")

@router.put("/conversations/{thread_id}/title", tags=["Conversations"])
async def update_conversation_title(thread_id: str, title: str):
    """Update the title of a conversation"""
    logger.info(f"=== Update Conversation Title: {thread_id} -> '{title}' ===")
    
    try:
        if not agent:
            logger.error("Agent not initialized")
            raise Exception("Agent not initialized")
        
        success = agent.update_conversation_title(thread_id, title)
        
        if not success:
            logger.warning(f"Conversation not found for title update: {thread_id}")
            raise HTTPException(status_code=404, detail=f"Conversation not found: {thread_id}")
        
        logger.info(f"Conversation title updated: {thread_id}")
        return {"message": f"Conversation title updated successfully", "thread_id": thread_id, "title": title}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update conversation title error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to update conversation title: {str(e)}")

