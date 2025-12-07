import requests

url_list = "http://localhost:8000/api/conversations"
try:
    # Get list first
    resp = requests.get(url_list)
    data = resp.json()
    conversations = data.get('conversations', [])
    
    if not conversations:
        print("No conversations found.")
    else:
        thread_id = conversations[0]['thread_id']
        print(f"Fetching details for thread: {thread_id}")
        
        # Get details
        url_detail = f"http://localhost:8000/api/conversations/{thread_id}"
        detail_resp = requests.get(url_detail)
        detail = detail_resp.json()
        
        print(f"Title: {detail.get('title')}")
        print(f"Message Count: {len(detail.get('messages', []))}")
        for msg in detail.get('messages', []):
            print(f"[{msg['role']}]: {msg['content'][:50]}...")

except Exception as e:
    print(f"Error: {e}")
