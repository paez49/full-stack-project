# Healthcare Management System


A full-stack application for managing healthcare-related data, including hospitals and patients.

- [Healthcare Management System](#healthcare-management-system)
  - [Project Structure](#project-structure)
  - [Backend API](#backend-api)
    - [Authentication](#authentication)
    - [Hospitals](#hospitals)
    - [Patients](#patients)
    - [Hospital Patients Management](#hospital-patients-management)
  - [Database Models](#database-models)
    - [Hospital Model](#hospital-model)
    - [Patient Model](#patient-model)
  - [Setup and Installation](#setup-and-installation)
  - [Deployment](#deployment)
    - [AWS Infrastructure Setup](#aws-infrastructure-setup)
    - [Docker Compose Configuration](#docker-compose-configuration)
    - [Deployment Steps](#deployment-steps)
    - [Environment Variables](#environment-variables)
      - [Backend (.env)](#backend-env)
    - [Access Points](#access-points)
  - [Development](#development)
    - [Testing the Application](#testing-the-application)
    - [Running Unit Tests](#running-unit-tests)
  - [Environment Variables](#environment-variables-1)
  - [Security](#security)
  - [Frontend Application](#frontend-application)
    - [Technology Stack](#technology-stack)
    - [Project Structure](#project-structure-1)
    - [Development](#development-1)
    - [Docker Support](#docker-support)
    - [Environment Setup](#environment-setup)
  - [A Note on Docker Deployment 🐳](#a-note-on-docker-deployment-)

## Project Structure

```
├── api/                    # Backend API
│   ├── model/             # Database models and DTOs
│   ├── routers/           # API endpoints
│   ├── service/           # Business logic
│   └── main.py           # FastAPI application entry point
├── frontend/              # Frontend application
│   ├── src/              # Source code
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Reusable UI components
│   │   ├── constants/    # Application constants
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layout/       # Layout components
│   │   ├── service/      # API service layer
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility functions
│   │   └── views/        # Page components
│   ├── public/           # Public static files
│   └── dist/             # Build output
└── scripts/              # Deployment and setup scripts
```

## Backend API

The backend is built using FastAPI and provides the following main endpoints:

### Authentication
- **POST /token**
  - Purpose: Authenticate users and generate JWT access token
  - Input: `RequestLogin` (email, password)
  - Output: `Token` (access_token, token_type)
  - Authentication: AWS Cognito
  - Error: 401 Unauthorized for invalid credentials

### Hospitals
- **POST /**
  - Purpose: Create new hospital
  - Authentication: Required (JWT)
  - Input: `HospitalCreateDTO`
  - Output: `HospitalResponseDTO`

- **GET /**
  - Purpose: Retrieve all hospitals
  - Authentication: Required (JWT)
  - Output: List of `HospitalResponseDTO`

- **GET /{hospital_id}**
  - Purpose: Get specific hospital
  - Authentication: Required (JWT)
  - Output: `HospitalResponseDTO`

- **PUT /{hospital_id}**
  - Purpose: Update existing hospital
  - Authentication: Required (JWT)
  - Input: `HospitalUpdateDTO`
  - Output: `HospitalResponseDTO`
  - Error: 404 if hospital not found

- **DELETE /{hospital_id}**
  - Purpose: Delete hospital
  - Authentication: Required (JWT)
  - Output: Success message

### Patients
- **GET /**
  - Purpose: Retrieve all patients
  - Authentication: Required (JWT)
  - Output: List of `PatientResponseDTO`
  
- **GET /{patient_id}**
  - Purpose: Get specific patient
  - Authentication: Required (JWT)
  - Output: `PatientResponseDTO`
  - Error: 404 if patient not found

- **POST /**
  - Purpose: Create new patient
  - Authentication: Required (JWT)
  - Input: `PatientCreateDTO`
  - Output: `PatientResponseDTO`

- **PUT /{patient_id}**
  - Purpose: Update existing patient
  - Authentication: Required (JWT)
  - Input: `PatientUpdateDTO`
  - Output: `PatientResponseDTO`
  - Error: 404 if patient not found

- **DELETE /{patient_id}**
  - Purpose: Delete patient
  - Authentication: Required (JWT)
  - Output: Success message
  - Error: 404 if patient not found

### Hospital Patients Management
- **POST /{hospital_id}/patients/{patient_id}**
  - Purpose: Assign patient to hospital
  - Authentication: Required (JWT)
  - Output: `PatientResponseDTO`
  - Error: 404 if hospital or patient not found

- **GET /{hospital_id}/patients**
  - Purpose: Get all patients in hospital
  - Authentication: Required (JWT)
  - Output: List of `PatientResponseDTO`
  - Error: 404 if hospital not found

## Database Models

### Hospital Model
- Table name: `hospitals`
- Fields:
  - `id`: Integer (Primary Key)
  - `name`: String (Required)
  - `address`: String
  - `capacity`: Integer
- Relationships:
  - One-to-Many relationship with Patient
- Properties:
  - `current_patients`: Returns count of associated patients

### Patient Model
- Table name: `patients`
- Fields:
  - `id`: Integer (Primary Key)
  - `name`: String (Required)
  - `age`: Integer
  - `oncological`: Boolean (Required)
  - `birth_date`: Date
  - `hospital_id`: Integer (Foreign Key to hospitals.id, Optional)
  - `cancer_type`: Enum (Optional)
- Relationships:
  - Many-to-One relationship with Hospital
- Constraints:
  - If `oncological` is TRUE, `cancer_type` must be specified
  - If `oncological` is FALSE, `cancer_type` must be NULL

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

The project includes automated deployment scripts and Docker Compose configuration for local development and production deployment.

### AWS Infrastructure Setup
The `deploy.sh` script automates the setup of required AWS resources:

1. **RDS Database Setup**:
   - Creates PostgreSQL RDS instance
   - Configures security groups
   - Sets up database credentials
   - Parameters:
     - Instance ID: `health-instance`
     - Database Name: `HealthOrganization`
     - Engine: PostgreSQL
     - Instance Class: `db.t3.micro`
     - Storage: 20GB
     - Region: `us-east-1`

2. **Cognito Authentication Setup**:
   - Creates User Pool
   - Configures App Client
   - Sets up Cognito Domain
   - Creates initial admin user
   - Parameters:
     - User Pool Name: `HospitalUsers`
     - App Client Name: `HospitalAPI`
     - Default Admin: `admin@hospital.com`

### Docker Compose Configuration
The application uses Docker Compose for containerized deployment:

```yaml
version: '3.8'

services:
  api:
    build: 
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - api
```

### Deployment Steps

1. **AWS Infrastructure**:
   ```bash
   # Run the deployment script
   ./deploy.sh
   ```
   This will:
   - Create RDS instance
   - Set up Cognito authentication
   - Generate environment files
   - Start Docker containers

2. **Docker Deployment**:
   ```bash
   # Start all services
   docker compose up -d
   ```

### Environment Variables
The deployment script automatically generates the following environment variables:

#### Backend (.env)
```
# RDS Configuration
RDS_ENDPOINT=<endpoint>
RDS_DB_NAME=HealthOrganization
RDS_USERNAME=postgres
RDS_PASSWORD=<generated>
RDS_SECURITY_GROUP_ID=<group-id>

# Cognito Configuration
AWS_REGION=us-east-1
USER_POOL_ID=<pool-id>
APP_CLIENT_ID=<client-id>
COGNITO_DOMAIN=<domain-url>
COGNITO_TEST_USER=admin@hospital.com
COGNITO_TEST_PASSWORD=Admin123!
```

### Access Points
- Frontend: http://localhost:80
- Backend API: http://localhost:8000
- Cognito Domain: https://<domain-prefix>.auth.us-east-1.amazoncognito.com

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

### Testing the Application

You can test the full application by following these steps:

1. First, ensure all dependencies are installed:
   ```bash
   # Install backend dependencies
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. Run the deployment script without the last line to set up the infrastructure:
   ```bash
   # Run the deployment script (excluding the last line)
   ./deploy.sh
   ```
   This will:
   - Create the RDS instance
   - Set up Cognito authentication
   - Generate environment files
   - Configure all necessary AWS resources

3. Start the application:
   ```bash
   # Start the backend
   cd api
   uvicorn main:app --reload

   # In a new terminal, start the frontend
   cd frontend
   npm run dev
   ```

The application will be accessible at:
- Frontend: http://localhost:5173 (Vite's default port)
- Backend API: http://localhost:8000

You can now test all features including:
- User authentication through Cognito
- Hospital management
- Patient management
- Hospital-Patient relationships

Note: The deployment script will set up all necessary AWS resources and generate the required environment variables. You don't need to run the last line of the script as it's meant for production deployment.

### Running Unit Tests

The backend includes a comprehensive test suite located in the `api/tests` directory. The tests are organized into unit tests that cover core functionality:

- `test_auth_service.py`: Authentication service tests
- `test_hospital_service.py`: Hospital management service tests
- `test_patient_service.py`: Patient management service tests

To run the unit tests:

1. Ensure you're in the backend directory and have activated the virtual environment:
   ```bash
   cd api
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Run all unit tests:
   ```bash
   pytest tests/unit/
   ```

3. Run specific test files:
   ```bash
   # Run authentication tests
   pytest tests/unit/test_auth_service.py

   # Run hospital service tests
   pytest tests/unit/test_hospital_service.py

   # Run patient service tests
   pytest tests/unit/test_patient_service.py
   ```

4. Run tests with detailed output:
   ```bash
   pytest -v tests/unit/
   ```

The tests use pytest fixtures defined in `conftest.py` for common setup and teardown operations. Make sure all dependencies are installed before running the tests.

## Environment Variables

The application requires the following environment variables:
- Database connection details
- AWS credentials
- Authentication settings

## Security

- Authentication is handled through AWS Cognito
- Database access is secured through proper IAM roles and policies
- API endpoints are protected with authentication middleware
- All endpoints (except authentication) require JWT token
- Token verification is handled by `verify_token` dependency

## Frontend Application

The frontend is built using React with TypeScript and Vite, featuring a modern tech stack:

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI Library**: Material-UI (MUI) 7
- **Styling**: 
  - Tailwind CSS 4
  - Emotion for styled components
- **Routing**: React Router 7
- **Notifications**: Notistack
- **Icons**: Lucide React

### Project Structure
- **Components**: Reusable UI components
- **Views**: Page-level components
- **Layout**: Application layout components
- **Service**: API integration layer
- **Hooks**: Custom React hooks
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions
- **Constants**: Application constants
- **Assets**: Static assets and resources

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Docker Support
The frontend includes Docker configuration for containerized deployment:
- Multi-stage build process
- Uses Node.js 18 Alpine for building
- Nginx for serving the production build
- Exposes port 80 for HTTP traffic

### Environment Setup
Required environment variables:
- `VITE_API_URL`: Backend API URL
- `VITE_AWS_REGION`: AWS Region for Cognito
- `VITE_USER_POOL_ID`: Cognito User Pool ID
- `VITE_APP_CLIENT_ID`: Cognito App Client ID 

## A Note on Docker Deployment 🐳

> "I tried to make the Docker deployment as easy as possible, but time was like a patient in the emergency room - it needed immediate attention elsewhere! While the Docker setup is functional, it's like a doctor's handwriting - it works, but you might need to squint a bit to understand it. Feel free to improve it, just like we improve our healthcare system - one container at a time! 😅" 