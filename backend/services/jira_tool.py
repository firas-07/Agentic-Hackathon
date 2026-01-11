import requests
from requests.auth import HTTPBasicAuth
from core.config import JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY
import logging
import json

logger = logging.getLogger('agent')

class JiraTicketTool:
    def __init__(self):
        self.base_url = JIRA_BASE_URL
        self.email = JIRA_EMAIL
        self.api_token = JIRA_API_TOKEN
        self.project_key = JIRA_PROJECT_KEY

        if not all([self.base_url, self.email, self.api_token, self.project_key]):
            logger.warning("Missing Jira environment variables. Jira tool will not function correctly.")
            # We don't raise error here to avoid crashing the app if env vars are missing, 
            # but create_ticket will fail or checks should be done there.
        
        if self.email and self.api_token:
            self.auth = HTTPBasicAuth(self.email, self.api_token)
        
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

    def create_ticket(self, summary: str, description: str, issue_type="Task"):
        logger.info(f"Attempting to create Jira ticket. Project: {self.project_key}, Summary: {summary}")
        
        if not all([self.base_url, self.email, self.api_token, self.project_key]):
            error_msg = "Missing Jira credentials in environment variables."
            logger.error(error_msg)
            return {
                "status": False,
                "error": error_msg
            }

        url = f"{self.base_url}/rest/api/3/issue"

        # Construct ADF (Atlassian Document Format) for description
        # Ensure description is a string
        if not isinstance(description, str):
            description = str(description)
            
        payload = {
            "fields": {
                "project": {"key": self.project_key},
                "summary": summary,
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {"type": "text", "text": description}
                            ]
                        }
                    ]
                },
                "issuetype": {"name": issue_type}
            }
        }
        
        logger.debug(f"Jira Payload: {json.dumps(payload)}")

        try:
            response = requests.post(
                url,
                headers=self.headers,
                auth=self.auth,
                json=payload
            )

            if response.status_code == 201:
                key = response.json()["key"]
                logger.info(f"Successfully created ticket: {key}")
                return {
                    "status": True,
                    "issue_key": key,
                    "link": f"{self.base_url}/browse/{key}"
                }
            
            error_text = response.text
            logger.error(f"Failed to create ticket. Status: {response.status_code}, Response: {error_text}")
            return {
                "status": False,
                "status_code": response.status_code,
                "error": error_text
            }

        except Exception as e:
            logger.error(f"Excpetion creating Jira ticket: {e}", exc_info=True)
            return {
                "status": False,
                "error": str(e)
            }

    @staticmethod
    def get_tool_definition():
        return {
            "type": "function",
            "function": {
                "name": "create_ticket",
                "description": "Create a new Jira ticket (issue/task) in the project.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "summary": {
                            "type": "string",
                            "description": "The summary or title of the ticket."
                        },
                        "description": {
                            "type": "string",
                            "description": "The detailed description of the issue/task."
                        },
                        "issue_type": {
                            "type": "string",
                            "description": "The type of issue (e.g., 'Task', 'Bug'). Default is 'Task'.",
                            "enum": ["Task", "Bug", "Story", "Epic"]
                        }
                    },
                    # 'issue_type' is optional but good to list it
                    "required": ["summary", "description"]
                }
            }
        }
