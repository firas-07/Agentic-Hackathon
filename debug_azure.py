
from azure.identity import ClientSecretCredential
from azure.ai.projects import AIProjectClient
import os
from dotenv import load_dotenv

load_dotenv()

try:
    credential = ClientSecretCredential(
        tenant_id=os.getenv("TENANT_ID"),
        client_id=os.getenv("CLIENT_ID"),
        client_secret=os.getenv("CLIENT_SECRET")
    )
    
    project = AIProjectClient(
        credential=credential,
        endpoint=os.getenv("PROJECT_ENDPOINT")
    )
    
    
    # Check what update methods exist
    agents_methods = [m for m in dir(project.agents) if 'update' in m.lower() or 'modify' in m.lower()]
    print(f"Update/Modify methods: {agents_methods}")
    
    pass



    
except Exception as e:
    print(f"Error: {e}")
