# 🚀 FastAPI Backend for Agentic RAG System

## **📖 Overview**
This FastAPI backend provides REST API endpoints for the Agentic RAG System, enabling applications to interact with an intelligent documentation assistant powered by Azure AI Foundry Agent. The system combines Confluence knowledge bases with Azure's GPT-4o-mini for accurate, context-aware responses.

## **🏗️ Backend Architecture**

```
┌─────────────────────┐
│   FastAPI Backend   │
│   (REST API)        │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐   ┌────▼────────────────┐
│Pinecone│   │ Azure AI Foundry    │
│Vector  │   │ Agent               │
│Database│   │ (GPT-4o-mini)       │
└───┬────┘   └────┬────────────────┘
    │             │
    │        ┌────▼─────────┐
    │        │ Azure AD     │
    │        │ Authentication│
    │        └──────────────┘
    │
┌───▼─────────────┐
│  Confluence     │
│  Knowledge Base │
└─────────────────┘
```

## **📁 Project Structure**

```
backend/
│
├── core/                     # ⚙️ Configuration
│   ├── config.py             # App configuration & Env vars
│   ├── logger.py             # Logging configuration
│   └── pipeline.py           # Document ingestion pipeline
│
├── logs/                     # 📝 Application logs
│   ├── app.log               # General application logs
│   ├── error.log             # Error-specific logs
│   └── README.md             # Logging documentation
│
├── models/                   # 📋 Pydantic schemas
│   ├── __init__.py
│   └── schemas.py            # API request/response models
│
├── routers/                  # 🛣️ API route handlers
│   ├── __init__.py
│   ├── chat.py              # Chat endpoint
│   ├── health.py            # Health check endpoints
│   └── knowledge_base.py    # Knowledge base endpoints
│
├── scripts/                  # 🔧 Utility scripts
│   ├── __init__.py
│   └── setup_db.py           # Database setup script
│
├── services/                 # 🧠 Business logic layer
│   ├── __init__.py
│   ├── agent.py              # Azure AI Agent integration & RAG logic
│   └── knowledge_base.py     # Document ingestion pipeline
│
├── .env                      # 🔐 Environment variables
├── .gitignore                # 📁 Git ignore file
├── create_agent.py           # 🤖 Azure agent creation script
├── main.py                   # 🚀 FastAPI application entry point
├── requirements.txt          # 📦 Backend dependencies
├── view_logs.ps1             # 📊 PowerShell log viewer
├── LOGGING.md                # 📚 Logging documentation
└── README.md                 # 📖 This file
```

## **🚀 Quick Start**

### **1. Prerequisites**
- Python 3.10+
- API Keys for: Atlassian (Confluence), Pinecone
- Azure AI Foundry account with:
  - Azure AD credentials (Tenant ID, Client ID, Client Secret)
  - AI Foundry project endpoint
  - Created Azure AI Agent ID

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

# Azure AI Foundry Configuration
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
PROJECT_ENDPOINT=https://your-project.api.azureml.ms
AZURE_AGENT_ID=asst_xxxxxxxxxxxxxxxxxxxxx

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
  "azure_agent_connected": true
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

### **Azure AI Foundry Setup**
1. **Create Azure AI Project**:
   - Go to [Azure AI Foundry](https://ai.azure.com/)
   - Create a new project or use existing one
   - Copy your Project Endpoint

2. **Set up Azure AD Authentication**:
   - Register an application in Azure AD
   - Create a client secret
   - Copy Tenant ID, Client ID, and Client Secret

3. **Create AI Agent**:
   ```bash
   cd backend
   python create_agent.py
   ```
   - This creates an agent named "AgentX-Firas" with GPT-4o-mini
   - Copy the returned Agent ID to your .env file as `AZURE_AGENT_ID`

## **🛠️ Development Features**

### **Router-Based Architecture**
The backend uses FastAPI's router system for clean separation of concerns:

- **`routers/chat.py`** - Handles chat interactions with the AI
- **`routers/knowledge_base.py`** - Manages document ingestion and statistics
- **`routers/health.py`** - Provides health monitoring capabilities

### **Service Layer**
Business logic is separated from API handlers:

- **`services/agent.py`** - Azure AI Agent integration with RAG functionality
- **`services/knowledge_base.py`** - Document processing and Pinecone operations

### **Comprehensive Logging System**
Production-ready logging with rotating file handlers:

- **`core/logger.py`** - Centralized logging configuration
- **`logs/app.log`** - General application logs (10MB rotation, 5 backups)
- **`logs/error.log`** - Error-specific logs with stack traces
- **`view_logs.ps1`** - PowerShell script for log viewing:
  - `view_logs.ps1` - View all logs
  - `view_logs.ps1 error` - View error logs only
  - `view_logs.ps1 live` - Real-time log monitoring
  - `view_logs.ps1 -lines 100` - View last 100 lines

**Logging Features:**
- UTF-8 encoding for cross-platform compatibility
- Detailed request/response tracking
- Azure AI Agent interaction logging
- Pinecone query performance metrics
- Automatic log rotation to prevent disk space issues

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
Ensure all credentials are correctly set in the `.env` file:
- Confluence API token (not your password)
- Pinecone API key
- Azure Tenant ID, Client ID, and Client Secret
- Azure Project Endpoint
- Azure Agent ID

#### **Azure AI Agent Issues**
If you encounter Azure authentication errors:
1. Verify your Azure AD credentials are correct
2. Ensure your service principal has proper permissions
3. Check that your Project Endpoint URL is correct
4. Verify the Agent ID matches your created agent

#### **Viewing Logs**
Use the PowerShell log viewer for troubleshooting:
```powershell
# View all logs
.\view_logs.ps1

# View only errors
.\view_logs.ps1 error

# Live monitoring
.\view_logs.ps1 live

# View specific number of lines
.\view_logs.ps1 -lines 50
```

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
2. Ensure Pinecone and Azure AI credentials are securely configured
3. Update CORS settings for your specific domain
4. Configure log rotation and monitoring
5. Set up Azure Key Vault for secure credential management
6. Enable Application Insights for Azure integration monitoring

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

The application includes a comprehensive logging system:
- **Rotating file handlers** - Automatic log rotation (10MB files, 5 backups)
- **UTF-8 encoding** - Cross-platform compatibility
- **Separate error logs** - Dedicated error.log with stack traces
- **Request tracking** - Detailed logging of all API requests
- **Azure AI monitoring** - Thread creation, run status, response retrieval
- **Pinecone metrics** - Query performance and match scores
- **Health check endpoints** - Real-time service status monitoring
- **PowerShell viewer** - Easy log analysis with view_logs.ps1

**Log Levels:**
- `INFO` - General application flow and operations
- `WARNING` - Potential issues that don't prevent operation
- `ERROR` - Critical errors with full stack traces

**Log Files:**
- `logs/app.log` - All application logs
- `logs/error.log` - Error logs only

See `LOGGING.md` for detailed logging documentation.

## **🎯 Future Enhancements**

- [ ] WebSocket support for real-time streaming responses
- [ ] Conversation memory/context retention
- [ ] Rate limiting and authentication middleware
- [ ] Advanced caching mechanisms
- [ ] Support for multiple document sources
- [ ] Admin dashboard for knowledge base management

---

**🚀 Ready to build your intelligent documentation assistant!**
