import pytest
from fastapi import HTTPException
from service.auth_service import authenticate_user, verify_token
from unittest.mock import patch, MagicMock
from jose import jwt

@pytest.mark.asyncio
async def test_authenticate_user_success(mock_cognito_client):
    # Arrange
    mock_response = {
        'AuthenticationResult': {
            'AccessToken': 'test-access-token',
            'IdToken': 'test-id-token',
            'RefreshToken': 'test-refresh-token'
        }
    }
    mock_cognito_client.initiate_auth.return_value = mock_response

    # Act
    result = await authenticate_user('testuser', 'testpass')

    # Assert
    assert result == mock_response['AuthenticationResult']
    mock_cognito_client.initiate_auth.assert_called_once_with(
        ClientId='test-client-id',
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={
            'USERNAME': 'testuser',
            'PASSWORD': 'testpass'
        }
    )

@pytest.mark.asyncio
async def test_authenticate_user_new_password_required(mock_cognito_client):
    # Arrange
    mock_cognito_client.initiate_auth.return_value = {
        'ChallengeName': 'NEW_PASSWORD_REQUIRED'
    }

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await authenticate_user('testuser', 'testpass')
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "You need to change your password."

@pytest.mark.asyncio
async def test_authenticate_user_failure(mock_cognito_client):
    # Arrange
    mock_cognito_client.initiate_auth.side_effect = Exception('Auth failed')

    # Act
    result = await authenticate_user('testuser', 'testpass')

    # Assert
    assert result is None

@pytest.mark.asyncio
async def test_verify_token_success():
    # Arrange
    mock_token = "valid.jwt.token"
    mock_credentials = MagicMock()
    mock_credentials.credentials = mock_token

    mock_jwks = {
        "keys": [{
            "kid": "test-kid",
            "kty": "RSA",
            "n": "test-n",
            "e": "test-e"
        }]
    }

    mock_header = {"kid": "test-kid"}
    mock_payload = {"sub": "test-user", "iss": "test-issuer"}

    with patch('service.auth_service.get_jwk', return_value=mock_jwks), \
         patch('service.auth_service.jwt.get_unverified_header', return_value=mock_header), \
         patch('service.auth_service.jwt.decode', return_value=mock_payload):
        
        # Act
        result = await verify_token(mock_credentials)

        # Assert
        assert result == mock_payload

@pytest.mark.asyncio
async def test_verify_token_invalid():
    # Arrange
    mock_credentials = MagicMock()
    mock_credentials.credentials = "invalid.token"

    mock_jwks = {
        "keys": [{
            "kid": "test-kid",
            "kty": "RSA",
            "n": "test-n",
            "e": "test-e"
        }]
    }

    mock_header = {"kid": "different-kid"}

    with patch('service.auth_service.get_jwk', return_value=mock_jwks), \
         patch('service.auth_service.jwt.get_unverified_header', return_value=mock_header):
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await verify_token(mock_credentials)
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Token inválido" 