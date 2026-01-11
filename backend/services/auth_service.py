import os
import sys
from datetime import datetime
from pinecone import Pinecone
from core.config import PINECONE_API_KEY, INDEX_NAME
from models.user import UserSignup, UserInDB, UserRole
from core.security import get_password_hash

class AuthService:
    def __init__(self):
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        self.index = self.pc.Index(INDEX_NAME)
        self.namespace = "users"
        self.vector_dim = 384  # Must match index dimension

    def get_user(self, username: str) -> UserInDB | None:
        try:
            response = self.index.fetch(ids=[username], namespace=self.namespace)
            if username in response.vectors:
                data = response.vectors[username]
                metadata = data.metadata
                return UserInDB(
                    username=username,
                    hashed_password=metadata.get("hashed_password"),
                    role=UserRole(metadata.get("role")),
                    created_at=metadata.get("created_at")
                )
            return None
        except Exception as e:
            print(f"Error fetching user: {e}")
            return None

    def create_user(self, user: UserSignup) -> UserInDB:
        # Check if user exists
        if self.get_user(user.username):
            raise ValueError("User already exists")

        hashed_password = get_password_hash(user.password)
        created_at = datetime.utcnow().isoformat()
        
        # Create dummy vector (Pinecone requires non-zero vector)
        dummy_vector = [0.0] * self.vector_dim
        dummy_vector[0] = 1.0

        metadata = {
            "hashed_password": hashed_password,
            "role": user.role.value,
            "created_at": created_at,
            "type": "user" # Tag to identify user records if needed
        }

        try:
            self.index.upsert(
                vectors=[{
                    "id": user.username,
                    "values": dummy_vector,
                    "metadata": metadata
                }],
                namespace=self.namespace
            )
            
            return UserInDB(
                username=user.username,
                hashed_password=hashed_password,
                role=user.role,
                created_at=created_at
            )
        except Exception as e:
            print(f"Error creating user: {e}")
            raise e
