import sys
import os

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from model.entities.database import Base
from unittest.mock import patch

@pytest.fixture
def db_session():
    """Create a fresh database for each test."""
    engine = create_engine(
        'sqlite:///:memory:',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def mock_cognito_client():
    """Mock AWS Cognito client."""
    with patch('boto3.client') as mock_client:
        yield mock_client.return_value

@pytest.fixture
def mock_jwt():
    """Mock JWT token."""
    return {
        'sub': 'test-user-id',
        'email': 'test@example.com',
        'cognito:username': 'testuser'
    } 