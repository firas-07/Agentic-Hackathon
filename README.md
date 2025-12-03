# 🚀 FastAPI Backend for Agentic RAG System

## **📖 Overview**
This FastAPI backend provides REST API endpoints for the Agentic RAG System, enabling frontend applications to interact with an intelligent documentation assistant that can chat with Confluence knowledge bases.

## **🏗️ Backend Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   FastAPI       │────│   Pinecone      │
│   (Web/Mobile)  │    │   Backend       │    │   Vector DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                       ┌─────────────────┐
                       │   Gemini AI     │
                       │   (LLM)         │
                       └─────────────────┘
```

## **📁 Project Structure**

```
backend/
│
├── core/                     # ⚙️ Configuration
│   └── config.py             # App configuration & Env vars
│   └── pipeline.py           # Document ingestion pipeline
│
├── models/                   # � Pydantic schemas
│   ├── __init__.py
│   └── schemas.py            # API request/response models
│
├── routers/                  # 🛣️ API route handlers
│   ├── __init__.py
│   ├── chat.py              # Chat endpoint
│   ├── health.py            # Health check endpoints
│   └── knowledge_base.py    # Knowledge base endpoints
│
|__ scripts/                 # 🛣️ API route handlers
│   ├── __init__.py
│   ├── setup_db.py           # Database setup script
│
├── services/                 # 🧠 Business logic layer
│   ├── __init__.py
│   ├── agent.py              # Query processing & LLM integration
│   └── knowledge_base.py     # Document ingestion pipeline
│
├── .env                      # 🔐 Environment variables
├── .gitignore                # � Git ignore file
├── main.py                   # 🚀 FastAPI application entry point
├── requirements.txt          # 📦 Backend dependencies
└── README.md                 # 📖 This file
```

## **🚀 Quick Start**

### **1. Prerequisites**
- Python 3.10+
- API Keys for: Atlassian (Confluence), Pinecone, and Google Gemini

### **2. Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### **3. Configure Environment**
```bash
# Create a .env file in the backend directory
touch .env
# Add your credentials to the .env file
```

**Environment Variables:**
```bash
# Confluence Configuration
EMAIL=your-email@company.com
API_TOKEN=your-atlassian-api-token
DOMAIN=your-domain.atlassian.net
PAGE_IDS=12345,67890,111213

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-key
INDEX_NAME=agentic-hackathon-index

# Gemini Configuration
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.0-flash

# Embedding Model Configuration
EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2
```

### **4. Start the Server**
```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python main.py
```

### **5. Access API Documentation**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## **🔗 API Endpoints**

### **🏥 Health Check Endpoints**
```
GET /api/
GET /api/health
```
Returns the health status of all connected services.

**Response:**
```json
{
  "status": "healthy",
  "pinecone_connected": true,
  "gemini_connected": true
}
```

### **💬 Chat Endpoint**
```
POST /api/chat
```
Chat with the knowledge base using natural language questions.

**Request:**
```json
{
  "query": "What are the application types?",
  "top_k": 3
}
```

**Response:**
```json
{
  "answer": "There are three application types: Individual, Family, and Corporate...",
  "sources": [
    {
      "source": "Confluence - Business Rules",
      "chunk_text": "Individual Application: For a single person...",
      "chunk_index": 0
    }
  ],
  "confidence_scores": [0.89, 0.76, 0.65]
}
```

### **📚 Knowledge Base Endpoints**

#### **Document Ingestion**
```
POST /api/ingest
```
Fetches documents from Confluence and uploads them to Pinecone.

**Response:**
```json
{
  "message": "Documents ingested successfully",
  "documents_processed": 2,
  "chunks_uploaded": 15
}
```

#### **Index Statistics**
```
GET /api/stats
```
Get statistics about the Pinecone index.

**Response:**
```json
{
  "total_vector_count": 150,
  "dimension": 384,
  "index_fullness": 0.15
}
```

## **⚙️ Configuration Details**

### **Confluence Setup**
1. **Get API Token**: 
   - Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Click "Create API Token"
   - Label it "AgenticHackathon" and copy the token

2. **Find Page IDs**:
   - Go to any Confluence page
   - Look at the URL: `.../pages/123456/Title`
   - The `123456` is your page ID

### **Pinecone Setup**
1. Sign up at [Pinecone](https://www.pinecone.io/) (Free tier available)
2. Create an index with 384 dimensions (matching the embedding model)
3. Copy your API key

### **Gemini Setup**
1. Get API key from [Google AI Studio](https://aistudio.google.com/)
2. Ensure you have access to Gemini 2.0 Flash model

## **🛠️ Development Features**

### **Router-Based Architecture**
The backend uses FastAPI's router system for clean separation of concerns:

- **`routers/chat.py`** - Handles chat interactions with the AI
- **`routers/knowledge_base.py`** - Manages document ingestion and statistics
- **`routers/health.py`** - Provides health monitoring capabilities

### **Service Layer**
Business logic is separated from API handlers:

- **`services/agent.py`** - AI chat functionality with Gemini integration
- **`services/knowledge_base.py`** - Document processing and Pinecone operations

### **Robust Error Handling**
- Comprehensive exception handling with proper HTTP status codes
- Graceful fallback to TF-IDF when SentenceTransformer fails
- Detailed error messages for debugging

### **CORS Configuration**
Configured for development (allows all origins). Update for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## **🔧 Troubleshooting**

### **Common Issues**

#### **Embedding Model Loading Issues**
The system automatically falls back to TF-IDF if SentenceTransformer fails:
```
Error with HuggingFace approach: [error details]
Using simple TF-IDF as fallback...
```

#### **API Key Issues**
Ensure all API keys are correctly set in the `.env` file:
- Confluence API token (not your password)
- Pinecone API key
- Gemini API key

#### **Module Import Errors**
The backend uses dynamic path resolution to handle imports from the parent directory.

### **Health Check Monitoring**
Use the health endpoints to monitor service status:
- `/api/health` - Check all service connections
- `/api/stats` - Monitor Pinecone index status

## **🚀 Deployment**

### **Docker Deployment**
```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Environment Setup for Production**
1. Set environment variables in your hosting platform
2. Ensure Pinecone and Gemini API keys are securely configured
3. Update CORS settings for your frontend domain
4. Configure proper logging and monitoring

## **🤝 Frontend Integration**

### **JavaScript/TypeScript Example**
```javascript
// Chat with the knowledge base
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'What are the eligibility criteria?',
    top_k: 3
  })
});

const result = await response.json();
console.log('Answer:', result.answer);
console.log('Sources:', result.sources);
```

### **Python Client Example**
```python
import requests

# Chat endpoint
response = requests.post('http://localhost:8000/api/chat', json={
    'query': 'What are the application types?'
})

result = response.json()
print(f"Answer: {result['answer']}")
```

## **📊 API Rate Limits & Performance**

- **Default top_k**: 3 (configurable per request)
- **Embedding Dimensions**: 384 (fixed for compatibility)
- **Response Time**: ~2-5 seconds depending on query complexity
- **Concurrent Requests**: Supported by FastAPI's async nature

## **🔒 Security Considerations**

- API keys should be stored securely in environment variables
- CORS should be restricted to specific domains in production
- Consider implementing rate limiting for production use
- Validate and sanitize all user inputs

## **📈 Monitoring & Logging**

The application includes:
- Console logging for service initialization
- Error logging with detailed messages
- Health check endpoints for monitoring
- Pinecone index statistics for performance tracking

## **🎯 Future Enhancements**

- [ ] WebSocket support for real-time streaming responses
- [ ] Conversation memory/context retention
- [ ] Rate limiting and authentication middleware
- [ ] Advanced caching mechanisms
- [ ] Support for multiple document sources
- [ ] Admin dashboard for knowledge base management

---

**🚀 Ready to build your intelligent documentation assistant!**
