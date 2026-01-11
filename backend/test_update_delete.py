import requests

url_list = "http://localhost:8000/api/conversations"

try:
    # Get list first to find a thread
    resp = requests.get(url_list)
    conversations = resp.json().get('conversations', [])
    
    if not conversations:
        print("No conversations to test update/delete.")
    else:
        thread_id = conversations[0]['thread_id']
        print(f"Target Thread: {thread_id}")
        
        # 1. Update Title
        new_title = "Updated Test Title"
        url_update = f"http://localhost:8000/api/conversations/{thread_id}/title"
        print(f"Updating title to: '{new_title}'")

        update_resp = requests.put(url_update, params={"title": new_title})
        print(f"Update Status: {update_resp.status_code}")
        print(f"Update Response: {update_resp.json()}")
        
        # 2. Delete Conversation
        url_delete = f"http://localhost:8000/api/conversations/{thread_id}"
        print(f"Deleting thread: {thread_id}")
        delete_resp = requests.delete(url_delete)
        print(f"Delete Status: {delete_resp.status_code}")
        print(f"Delete Response: {delete_resp.json()}")
        
        # Verify deletion
        check_resp = requests.get(f"http://localhost:8000/api/conversations/{thread_id}")
        if check_resp.status_code == 404:
            print("Verification: Thread successfully deleted (404 Not Found)")
        else:
            print(f"Verification Failed: Status {check_resp.status_code}")

except Exception as e:
    print(f"Error: {e}")
