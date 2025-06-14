from fastapi import APIRouter, HTTPException, Depends
from typing import List
from model.entities.patient import Patient
from service.patient_service import PatientService
from model.dtos.patient import PatientResponseDTO, PatientUpdateDTO, PatientCreateDTO
from service.auth_service import verify_token

router = APIRouter()
patient_service = PatientService()

@router.get("/", response_model=List[PatientResponseDTO], tags=["Patients"])
async def get_patients(token: dict = Depends(verify_token)):
    """
    Retrieve all patients.
    
    Returns a list of all patients in the system.
    
    Args:
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        List[PatientResponseDTO]: List of patient objects containing patient information
        
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
    return patient_service.get_all_patients()

@router.get("/{patient_id}", response_model=PatientResponseDTO, tags=["Patients"])
async def get_patient(patient_id: int, token: dict = Depends(verify_token)):
    """
    Retrieve a specific patient by ID.
    
    Args:
        patient_id (int): The unique identifier of the patient
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        PatientResponseDTO: Patient object containing patient information
        
    Raises:
        HTTPException: 404 Not Found if patient doesn't exist
        
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
    patient = patient_service.get_patient_by_id(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/", response_model=PatientResponseDTO, tags=["Patients"])
async def create_patient(patient: PatientCreateDTO, token: dict = Depends(verify_token)):
    """
    Create a new patient.
    
    Args:
        patient (PatientCreateDTO): Patient data for creation
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        PatientResponseDTO: Created patient object with assigned ID
        
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
    return patient_service.create_patient(patient)

@router.put("/{patient_id}", response_model=PatientResponseDTO, tags=["Patients"])
async def update_patient(patient_id: int, patient: PatientUpdateDTO, token: dict = Depends(verify_token)):
    """
    Update an existing patient.
    
    Args:
        patient_id (int): The unique identifier of the patient to update
        patient (PatientUpdateDTO): Updated patient data
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        PatientResponseDTO: Updated patient object
        
    Raises:
        HTTPException: 404 Not Found if patient doesn't exist
        
    Example:
        ```json
        {
            "id": 1,
            "name": "John Doe Updated",
            "age": 31,
            "medical_history": "Updated history..."
        }
        ```
    """
    updated_patient = patient_service.update_patient(patient_id, patient)
    if not updated_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated_patient

@router.delete("/{patient_id}", tags=["Patients"])
async def delete_patient(patient_id: int, token: dict = Depends(verify_token)):
    """
    Delete a patient.
    
    Args:
        patient_id (int): The unique identifier of the patient to delete
        token (dict): JWT token for authentication (automatically handled by FastAPI)
        
    Returns:
        dict: Success message
        
    Raises:
        HTTPException: 404 Not Found if patient doesn't exist
        
    Example:
        ```json
        {
            "message": "Patient deleted successfully"
        }
        ```
    """
    success = patient_service.delete_patient(patient_id)
    if not success:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient deleted successfully"}
