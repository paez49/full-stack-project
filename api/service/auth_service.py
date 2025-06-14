import boto3
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import ExpiredSignatureError, jwt 
import httpx
import os
# Configura tu pool
COGNITO_REGION = os.getenv("AWS_REGION")
USER_POOL_ID = os.getenv("USER_POOL_ID")
APP_CLIENT_ID = os.getenv("APP_CLIENT_ID")
COGNITO_ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"

JWKS_URL = f"{COGNITO_ISSUER}/.well-known/jwks.json"

security = HTTPBearer()
security = HTTPBearer()
jwks = {}

client = boto3.client("cognito-idp", region_name=COGNITO_REGION)

async def get_jwk():
    global jwks
    if not jwks:
        async with httpx.AsyncClient() as client:
            r = await client.get(JWKS_URL)
            jwks = r.json()
    return jwks

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        jwks = await get_jwk()
        unverified_header = jwt.get_unverified_header(token)
        key = next(
            (k for k in jwks["keys"] if k["kid"] == unverified_header["kid"]),
            None
        )
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token")

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=COGNITO_ISSUER
        )
        return payload

    except HTTPException as e:
        raise HTTPException(status_code=401, detail="Token inválido")
    except ExpiredSignatureError as e:
        raise HTTPException(status_code=401, detail="Token expirado")


async def authenticate_user(username: str, password: str):
    try:
        response = client.initiate_auth(
            ClientId=APP_CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            }
        )
        if response.get("ChallengeName") == "NEW_PASSWORD_REQUIRED":
            raise HTTPException(status_code=400, detail="You need to change your password.")
        return response['AuthenticationResult']
    except Exception as e:
        return None