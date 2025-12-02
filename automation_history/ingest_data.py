import requests
from requests.auth import HTTPBasicAuth
from bs4 import BeautifulSoup
import os
import pypdf

# --- CONFIGURATION ---
# TODO: Move these to a secure config file or environment variables later
EMAIL = "your-email@example.com"
API_TOKEN = "YOUR_ATLASSIAN_API_TOKEN"
DOMAIN = "agent-support.atlassian.net"

# List of Confluence Page IDs to ingest
PAGE_IDS = ["557057", "851969"] 

class KnowledgeBase:
    def __init__(self):
        self.documents = []

    def clean_html(self, html_content):
        """
        Converts raw HTML from Confluence into clean, readable text.
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
            
        text = soup.get_text(separator=' ')
        
        # Break into lines and remove leading/trailing space on each
        lines = (line.strip() for line in text.splitlines())
        # Break multi-headlines into a line each
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        # Drop blank lines
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text

    def fetch_confluence_page(self, page_id):
        """
        Fetches a single page from Confluence and returns the title and cleaned text.
        """
        url = f"https://{DOMAIN}/wiki/rest/api/content/{page_id}?expand=body.storage"
        
        print(f"Fetching Confluence Page ID: {page_id}...")
        response = requests.get(
            url,
            auth=HTTPBasicAuth(EMAIL, API_TOKEN),
            headers={"Accept": "application/json"}
        )

        if response.status_code == 200:
            data = response.json()
            title = data["title"]
            raw_html = data["body"]["storage"]["value"]
            clean_text = self.clean_html(raw_html)
            
            print(f"Successfully fetched: {title}")
            return {
                "source": f"Confluence - {title}",
                "content": clean_text
            }
        else:
            print(f"Error fetching page {page_id}: {response.status_code} - {response.text}")
            return None

    def ingest_pdfs(self):
        """
        Finds all PDF files in the current directory and extracts their text.
        """
        print("Scanning for PDF files...")
        current_dir = os.getcwd()
        for filename in os.listdir(current_dir):
            if filename.lower().endswith(".pdf"):
                file_path = os.path.join(current_dir, filename)
                print(f"Processing PDF: {filename}...")
                
                try:
                    reader = pypdf.PdfReader(file_path)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text() + "\n"
                    
                    self.documents.append({
                        "source": f"PDF - {filename}",
                        "content": text
                    })
                    print(f"Successfully extracted text from {filename}")
                except Exception as e:
                    print(f"Failed to read {filename}: {e}")

    def ingest_all(self):
        """
        Main function to gather all data.
        """
        print("--- STARTING DATA INGESTION ---")
        
        # 1. Ingest Confluence Pages
        for pid in PAGE_IDS:
            doc = self.fetch_confluence_page(pid)
            if doc:
                self.documents.append(doc)

        # 2. Ingest Local PDFs
        self.ingest_pdfs()

        print(f"--- INGESTION COMPLETE. Total Documents: {len(self.documents)} ---")
        
        # For verification, print the first few characters of each
        for doc in self.documents:
            print(f"\nSource: {doc['source']}")
            print(f"Preview: {doc['content'][:200]}...")

if __name__ == "__main__":
    kb = KnowledgeBase()
    kb.ingest_all()
