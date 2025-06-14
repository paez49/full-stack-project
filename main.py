# FastAPI app
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model.entities.database import shutdown, startup
from routers import auth_router, hospital_router, patient_router


# Create FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    
    Handles startup and shutdown events for the application:
    - Startup: Initializes database connection
    - Shutdown: Closes database connection
    """
    startup()
    yield
    shutdown()


app = FastAPI(
    title="Healthcare API",
    description="A comprehensive API for managing healthcare-related data including patients and hospitals",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(patient_router.router, prefix="/patients", tags=["Patients"])
app.include_router(hospital_router.router, prefix="/hospitals")

# Root endpoint
@app.get("/", tags=["General"])
async def root():
    """
    Root endpoint of the Healthcare API.
    
    Returns:
        dict: A welcome message indicating successful API connection.
    """
    return {"message": "Welcome to Healthcare API"}

# Health check endpoint
@app.get("/health", tags=["General"])
async def health_check():
    """
    Health check endpoint to verify API status.
    
    This endpoint is used to monitor the health and availability of the API service.
    It returns the current status of the service.
    
    Returns:
        dict: A dictionary containing:
            - status: Current health status
            - service: Service status
            - message: Descriptive message about the service state
    """
    return {
        "status": "healthy",
        "service": "up",
        "message": "Service is running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

