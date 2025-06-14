from fastapi import HTTPException
from model.entities.patient import Patient
from model.dtos.patient import PatientCreateDTO, PatientResponseDTO, PatientUpdateDTO
from model.entities.database import SessionLocal
from sqlalchemy import select
from typing import List

class PatientService:
    def __init__(self):
        self.session = SessionLocal()

    def create_patient(self, patient: PatientCreateDTO) -> PatientResponseDTO:
        db_patient = Patient(**patient.model_dump())
        self.session.add(db_patient)
        self.session.commit()
        self.session.refresh(db_patient)
        return PatientResponseDTO(**db_patient.__dict__)

    def get_all_patients(self) -> List[PatientResponseDTO]:
        result = self.session.execute(select(Patient))
        patients = result.scalars().all()
        return [PatientResponseDTO(**p.__dict__) for p in patients]

    def get_patient_by_id(self, patient_id: int) -> PatientResponseDTO:
        result = self.session.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalar_one_or_none()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return PatientResponseDTO(**patient.__dict__)

    def update_patient(self, patient_id: int, patient: PatientUpdateDTO) -> PatientResponseDTO:
        db_patient = self.get_patient_by_id(patient_id)
        for key, value in patient.model_dump().items():
            setattr(db_patient, key, value)
        self.session.commit()
        self.session.refresh(db_patient)
        return PatientResponseDTO(**db_patient.__dict__)

    def delete_patient(self, patient_id: int) -> bool:
        db_patient = self.get_patient_by_id(patient_id)
        self.session.delete(db_patient)
        self.session.commit()
        return True
