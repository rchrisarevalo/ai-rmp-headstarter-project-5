from dotenv import load_dotenv
load_dotenv()
import os
import openai
from pinecone import Pinecone, ServerlessSpec

# Basic set up.
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
pc.create_index(
    name="rag",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)