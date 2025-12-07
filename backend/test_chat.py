import requests
import json

url = "http://localhost:8000/api/chat"
payload = {
    "query": "What is the Agentic RAG System?",
    "top_k": 3
}
headers = {"Content-Type": "application/json"}

try:
    print(f"Sending query: {payload['query']}")
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()
    
    print("\n=== Response ===")
    print(f"Answer: {data.get('answer')}")
    print(f"Thread ID: {data.get('thread_id')}")
    print(f"Sources: {len(data.get('sources', []))}")
    for source in data.get('sources', []):
        print(f" - {source.get('source')} (Score: {source.get('score')})")
        
except Exception as e:
    print(f"Error: {e}")
    if 'response' in locals():
        print(f"Response content: {response.text}")
