from google import genai
import os

# --- CONFIGURATION ---
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

def test_gemini():
    print("Testing Gemini API Connection...")
    
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents="Explain how AI works in a few words"
        )
        
        print("\n--- GEMINI RESPONSE ---")
        print(response.text)
        print("-----------------------")
        print("SUCCESS: API Key is working!")
        
    except Exception as e:
        print(f"\nERROR: Failed to connect to Gemini API.\nDetails: {e}")

if __name__ == "__main__":
    test_gemini()
