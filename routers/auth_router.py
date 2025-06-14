import boto3
from fastapi import APIRouter, Depends, HTTPException, status
import os

from fastapi.security import OAuth2PasswordRequestForm
from model.dtos.auth import Token
from service.auth_service import authenticate_user
COGNITO_REGION = os.getenv("AWS_REGION")
USER_POOL_ID = os.getenv("USER_POOL_ID")
APP_CLIENT_ID = os.getenv("APP_CLIENT_ID")
router = APIRouter()
client = boto3.client("cognito-idp", region_name=COGNITO_REGION)

@router.post("/token", response_model=Token, tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and generate access token.
    
    This endpoint authenticates users using AWS Cognito and returns a JWT access token
    that can be used for subsequent API requests.
    
    Args:
        form_data (OAuth2PasswordRequestForm): The login credentials containing:
            - username: The user's email or username
            - password: The user's password
            
    Returns:
        Token: A dictionary containing:
            - access_token: JWT token for authentication
            - token_type: Type of token (always "bearer")
            
    Raises:
        HTTPException: 401 Unauthorized if credentials are invalid
        
    Example:
        ```json
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "bearer"
        }
        ```
    """
    auth_result = await authenticate_user(form_data.username, form_data.password)
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
