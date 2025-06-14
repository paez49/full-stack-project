from fastapi import HTTPException
from model.entities.patient import Patient
from model.dtos.patient import PatientCreateDTO, PatientResponseDTO, PatientUpdateDTO
from model.entities.database import SessionLocal
from sqlalchemy import select
from typing import List
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
class PatientService:
    def __init__(self):
        self.session = SessionLocal()

    def create_patient(self, patient: PatientCreateDTO) -> PatientResponseDTO:
        db_patient = Patient(**patient.model_dump())
        self.session.add(db_patient)
        try:
            self.session.commit()
            self.session.refresh(db_patient)
            return db_patient

        except IntegrityError as e:
            self.session.rollback()

            if "check_oncological_cancer_type" in str(e.orig):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid data: cancer_type must be null when oncological is False."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Database integrity error."
                )

    def get_all_patients(self) -> List[PatientResponseDTO]:
        result = self.session.execute(select(Patient))
        patients = result.scalars().all()
        return [PatientResponseDTO(**p.__dict__) for p in patients]

    def get_patient_by_id(self, patient_id: int) -> Patient:
        result = self.session.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalar_one_or_none()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient

    def update_patient(self, patient_id: int, patient: PatientUpdateDTO) -> Patient:
        db_patient = self.get_patient_by_id(patient_id)
        for key, value in patient.model_dump().items():
            setattr(db_patient, key, value)
        try:
            self.session.commit()
            self.session.refresh(db_patient)
            return db_patient

        except IntegrityError as e:
            self.session.rollback()

            if "check_oncological_cancer_type" in str(e.orig):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid data: cancer_type must be null when oncological is False."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Database integrity error."
                )

    def delete_patient(self, patient_id: int) -> bool:
        db_patient = self.get_patient_by_id(patient_id)
        self.session.delete(db_patient)
        self.session.commit()
        return True
