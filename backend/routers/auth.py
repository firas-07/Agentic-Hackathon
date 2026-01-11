from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from models.user import UserSignup, UserLogin, Token, UserInDB
from services.auth_service import AuthService
from core.security import verify_password, create_access_token
from datetime import timedelta
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(tags=["Authentication"])
auth_service = AuthService()

@router.post("/signup", response_model=Token)
async def signup(user: UserSignup):
    try:
        created_user = auth_service.create_user(user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create user"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": created_user.username, "role": created_user.role.value},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": created_user.role.value,
        "username": created_user.username
    }

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = auth_service.get_user(user.username)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username, "role": db_user.role.value},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": db_user.role.value,
        "username": db_user.username
    }
