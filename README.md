# Healthcare Management System

A full-stack application for managing healthcare-related data, including hospitals and patients.

## Project Structure

```
├── api/                    # Backend API
│   ├── model/             # Database models and DTOs
│   ├── routers/           # API endpoints
│   ├── service/           # Business logic
│   └── main.py           # FastAPI application entry point
├── frontend/              # Frontend application
└── scripts/              # Deployment and setup scripts
```

## Backend API

The backend is built using FastAPI and provides the following main endpoints:

### Authentication
- Authentication endpoints for user management

### Hospitals
- CRUD operations for hospital management
- Endpoints for hospital-related operations

### Patients
- CRUD operations for patient management
- Endpoints for patient-related operations

## Database Models

### Hospital
- Basic hospital information management
- Hospital entity with essential fields

### Patient
- Patient information management
- Patient entity with related fields

## Setup and Installation

1. Backend Setup:
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Frontend Setup:
   ```bash
   cd frontend
   npm install
   ```

## Deployment

The project includes scripts for AWS deployment:
- `create_rds_and_cognito_pool.sh`: Sets up RDS database and Cognito user pool
- `clean_up.sh`: Cleanup script for AWS resources

## Development

To run the development server:

1. Start the backend:
   ```bash
   cd api
   uvicorn main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Environment Variables

The application requires the following environment variables:
- Database connection details
- AWS credentials
- Authentication settings

## Security

- Authentication is handled through AWS Cognito
- Database access is secured through proper IAM roles and policies
- API endpoints are protected with authentication middleware 