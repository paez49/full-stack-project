from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .base import Base

# Database Configuration for RDS
import os

DATABASE_URL = f"postgresql+psycopg2://{os.getenv('RDS_USERNAME')}:{os.getenv('RDS_PASSWORD')}@{os.getenv('RDS_ENDPOINT')}:5432/{os.getenv('RDS_DB_NAME')}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def startup():
    Base.metadata.create_all(engine)

def shutdown():
    Base.metadata.drop_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 