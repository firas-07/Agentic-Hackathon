import requests
from requests.auth import HTTPBasicAuth

# --- REQUIRED VALUES (UPDATE THESE) ---
EMAIL = "your-email@example.com"           # your Atlassian email
API_TOKEN = "YOUR_ATLASSIAN_API_TOKEN"          # your new API token
PAGE_ID = "557057"                        # from your URL
DOMAIN = "agent-support.atlassian.net"     # your Confluence domain

# --- API URL ---
url = f"https://{DOMAIN}/wiki/rest/api/content/{PAGE_ID}?expand=body.storage"

# --- Send GET Request ---
response = requests.get(
    url,
    auth=HTTPBasicAuth(EMAIL, API_TOKEN),
    headers={"Accept": "application/json"}
)

# --- Check Response ---
if response.status_code == 200:
    data = response.json()
    html_content = data["body"]["storage"]["value"]
    print("===== PAGE TITLE =====")
    print(data["title"])
    print("\n===== HTML CONTENT =====")
    print(html_content)
else:
    print("Error:", response.status_code, response.text)
