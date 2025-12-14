from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Convert to bytes
    if isinstance(plain_password, str):
        pwd_bytes = plain_password.encode('utf-8')
    else:
        pwd_bytes = plain_password
        
    if isinstance(hashed_password, str):
        hash_bytes = hashed_password.encode('utf-8')
    else:
        hash_bytes = hashed_password
        
    # Truncate to 72 bytes (bcrypt limit)
    return bcrypt.checkpw(pwd_bytes[:72], hash_bytes)

def get_password_hash(password: str) -> str:
    if isinstance(password, str):
        pwd_bytes = password.encode('utf-8')
    else:
        pwd_bytes = password
        
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes[:72], salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
