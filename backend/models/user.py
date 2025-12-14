from pydantic import BaseModel
from enum import Enum
from typing import Optional

class UserRole(str, Enum):
    END_USER = "End User"
    BUSINESS_USER = "Business User"

class UserBase(BaseModel):
    username: str

class UserSignup(UserBase):
    password: str
    role: UserRole

class UserLogin(UserBase):
    password: str

class UserInDB(UserBase):
    hashed_password: str
    role: UserRole
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
