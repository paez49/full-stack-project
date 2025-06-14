from fastapi import APIRouter, HTTPException, Depends
from typing import List

from model.dtos.hospital import HospitalResponseDTO, HospitalCreateDTO
from model.dtos.patient import PatientCreateDTO, PatientResponseDTO
from service.hospital_service import HospitalService
from service.auth_service import verify_token

router = APIRouter()
hospital_service = HospitalService()

# Hospital endpoints
@router.post("/", response_model=HospitalResponseDTO)
async def create_hospital(hospital: HospitalCreateDTO, token: dict = Depends(verify_token)):
    """
    Create a new hospital.
    
    Args:
        hospital (HospitalCreateDTO): Hospital data for creation
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        HospitalResponseDTO: Created hospital object with assigned ID
        
    Example:
        ```json
        {
            "id": 1,
            "name": "General Hospital",
            "address": "123 Medical St",
            "capacity": 500
        }
        ```
    """
    return hospital_service.create_hospital(hospital)

@router.get("/", response_model=List[HospitalResponseDTO])
async def get_hospitals(token: dict = Depends(verify_token)):
    """
    Retrieve all hospitals.
    
    Returns a list of all hospitals in the system.
    
    Args:
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        List[HospitalResponseDTO]: List of hospital objects
        
    Example:
        ```json
        [
            {
                "id": 1,
                "name": "General Hospital",
                "address": "123 Medical St",
                "capacity": 500
            }
        ]
        ```
    """
    return hospital_service.get_all_hospitals()

@router.get("/{hospital_id}", response_model=HospitalResponseDTO)
async def get_hospital(hospital_id: int, token: dict = Depends(verify_token)):
    """
    Retrieve a specific hospital by ID.
    
    Args:
        hospital_id (int): The unique identifier of the hospital
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        HospitalResponseDTO: Hospital object containing hospital information
        
    Raises:
        HTTPException: 404 Not Found if hospital doesn't exist
        
    Example:
        ```json
        {
            "id": 1,
            "name": "General Hospital",
            "address": "123 Medical St",
            "capacity": 500
        }
        ```
    """
    return hospital_service.get_hospital_by_id(hospital_id)

@router.put("/{hospital_id}", response_model=HospitalResponseDTO)
async def update_hospital(hospital_id: int, hospital: HospitalCreateDTO, token: dict = Depends(verify_token)):
    """
    Update an existing hospital.
    
    Args:
        hospital_id (int): The unique identifier of the hospital to update
        hospital (HospitalCreateDTO): Updated hospital data
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        HospitalResponseDTO: Updated hospital object
        
    Raises:
        HTTPException: 404 Not Found if hospital doesn't exist
        
    Example:
        ```json
        {
            "id": 1,
            "name": "Updated General Hospital",
            "address": "456 Medical Ave",
            "capacity": 600
        }
        ```
    """
    return hospital_service.update_hospital(hospital_id, hospital)

@router.delete("/{hospital_id}")
async def delete_hospital(hospital_id: int, token: dict = Depends(verify_token)):
    """
    Delete a hospital.
    
    Args:
        hospital_id (int): The unique identifier of the hospital to delete
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        dict: Success message
        
    Raises:
        HTTPException: 404 Not Found if hospital doesn't exist
        
    Example:
        ```json
        {
            "message": "Hospital deleted successfully"
        }
        ```
    """
    hospital_service.delete_hospital(hospital_id)
    return {"message": "Hospital deleted successfully"}

# Patient management endpoints
@router.post("/{hospital_id}/patients", response_model=PatientResponseDTO, tags=["Hospital Patients"])
async def add_patient_to_hospital(hospital_id: int, patient: PatientCreateDTO, token: dict = Depends(verify_token)):
    """
    Add a new patient to a specific hospital.
    
    Args:
        hospital_id (int): The unique identifier of the hospital
        patient (PatientCreateDTO): Patient data for creation
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        PatientResponseDTO: Created patient object with assigned ID
        
    Raises:
        HTTPException: 404 Not Found if hospital doesn't exist
        
    Example:
        ```json
        {
            "id": 1,
            "name": "John Doe",
            "age": 30,
            "medical_history": "..."
        }
        ```
    """
    return hospital_service.add_patient_to_hospital(hospital_id, patient)

@router.get("/{hospital_id}/patients", response_model=List[PatientResponseDTO], tags=["Hospital Patients"])
async def get_hospital_patients(hospital_id: int, token: dict = Depends(verify_token)):
    """
    Retrieve all patients in a specific hospital.
    
    Args:
        hospital_id (int): The unique identifier of the hospital
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        List[PatientResponseDTO]: List of patient objects in the hospital
        
    Raises:
        HTTPException: 404 Not Found if hospital doesn't exist
        
    Example:
        ```json
        [
            {
                "id": 1,
                "name": "John Doe",
                "age": 30,
                "medical_history": "..."
            }
        ]
        ```
    """
    return hospital_service.get_hospital_patients(hospital_id)
