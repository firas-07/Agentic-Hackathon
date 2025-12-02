from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from google import genai
import textwrap

# --- CONFIGURATION ---
PINECONE_API_KEY = "YOUR_PINECONE_API_KEY"
INDEX_NAME = "agentic-hackathon-index"
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

class Agent:
    def __init__(self):
        # 1. Initialize Pinecone
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        self.index = self.pc.Index(INDEX_NAME)
        
        # 2. Initialize Embedding Model (Local)
        print("Loading embedding model...")
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 3. Initialize Gemini
        self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)

    def search_knowledge_base(self, query, top_k=3):
        """
        Searches Pinecone for the most relevant chunks of text.
        """
        # Convert query to vector
        query_vector = self.embed_model.encode(query).tolist()
        
        # Search Pinecone
        results = self.index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True
        )
        
        return results['matches']

    def ask(self, query):
        print(f"\nUser Question: {query}")
        print("Searching knowledge base...")
        
        # 1. Retrieve relevant context
        matches = self.search_knowledge_base(query)
        
        if not matches:
            return "I couldn't find any information about that in the knowledge base."

        # Prepare context string
        context_text = ""
        print("\n--- Retrieved Context ---")
        for match in matches:
            source = match['metadata']['source']
            text = match['metadata']['chunk_text']
            score = match['score']
            print(f"[{score:.2f}] {source}: {text[:100]}...")
            context_text += f"\nSource: {source}\nContent: {text}\n"

        # 2. Generate Answer with Gemini
        prompt = f"""
        You are a helpful assistant for a business application.
        Use the following context from the company's documentation to answer the user's question.
        If the answer is not in the context, say you don't know.
        
        Context:
        {context_text}
        
        User Question: {query}
        
        Answer:
        """
        
        print("\nGenerating answer with Gemini...")
        response = self.gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        final_answer = response.text
        
        print("\n=== FINAL ANSWER ===")
        print(textwrap.fill(final_answer, width=80))
        return final_answer

if __name__ == "__main__":
    agent = Agent()
    
    # Interactive Loop
    print("\n\n*** Agent Ready! Type 'exit' to quit. ***")
    while True:
        user_input = input("\nAsk a question: ")
        if user_input.lower() in ['exit', 'quit']:
            break
        
        agent.ask(user_input)
