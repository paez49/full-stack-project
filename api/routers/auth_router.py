import boto3
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import os

from model.dtos.auth import Token
from service.auth_service import authenticate_user

COGNITO_REGION = os.getenv("AWS_REGION")
USER_POOL_ID = os.getenv("USER_POOL_ID")
APP_CLIENT_ID = os.getenv("APP_CLIENT_ID")

router = APIRouter()
client = boto3.client("cognito-idp", region_name=COGNITO_REGION)

class RequestLogin(BaseModel):
    email: str
    password: str

@router.post("/token", response_model=Token, tags=["Authentication"])
async def login_for_access_token(request: RequestLogin):
    """
    Authenticate user and generate access token.
    
    This endpoint authenticates users using AWS Cognito and returns a JWT access token
    that can be used for subsequent API requests.
    
    Args:
        request (RequestLogin): The login credentials containing:
            - email: The user's email
            - password: The user's password
            
    Returns:
        Token: A dictionary containing:
            - access_token: JWT token for authentication
            - token_type: Type of token (always "bearer")
            
    Raises:
        HTTPException: 401 Unauthorized if credentials are invalid
    """
    auth_result = await authenticate_user(request.email, request.password)
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "access_token": auth_result["AccessToken"],
        "token_type": "bearer"
    }
