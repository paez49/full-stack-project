from fastapi import HTTPException
from model.entities.hospital import Hospital
from model.entities.patient import Patient
from model.dtos.hospital import HospitalCreateDTO, HospitalResponseDTO, HospitalUpdateDTO
from model.dtos.patient import PatientCreateDTO, PatientResponseDTO
from model.entities.database import  SessionLocal

from sqlalchemy import select
from typing import List

class HospitalService:
    def __init__(self):
        self.session = SessionLocal()

    def create_hospital(self, hospital: HospitalCreateDTO) -> HospitalResponseDTO:
        db_hospital = Hospital(**hospital.model_dump())
        self.session.add(db_hospital)
        self.session.commit()
        self.session.refresh(db_hospital)
        return HospitalResponseDTO(**db_hospital.__dict__)

    def get_all_hospitals(self) -> List[HospitalResponseDTO]:
        result = self.session.execute(select(Hospital))
        hospitals = result.scalars().all()
        return [HospitalResponseDTO(**h.__dict__) for h in hospitals]

    def get_hospital_by_id(self, hospital_id: int) -> Hospital:
        result = self.session.execute(select(Hospital).where(Hospital.id == hospital_id))
        hospital = result.scalar_one_or_none()
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        return hospital

    def update_hospital(self, hospital_id: int, hospital: HospitalUpdateDTO) -> Hospital:
        db_hospital = self.get_hospital_by_id(hospital_id)
        for key, value in hospital.model_dump().items():
            setattr(db_hospital, key, value)
        self.session.commit()
        self.session.refresh(db_hospital)
        return db_hospital

    def delete_hospital(self, hospital_id: int) -> bool:
        db_hospital = self.get_hospital_by_id(hospital_id)
        self.session.delete(db_hospital)
        self.session.commit()
        return True

    def add_patient_to_hospital(self, hospital_id: int, patient: PatientCreateDTO) -> PatientResponseDTO:
        self.get_hospital_by_id(hospital_id)  # Verify hospital exists
        db_patient = Patient(**patient.model_dump(), hospital_id=hospital_id)
        self.session.add(db_patient)
        self.session.commit()
        self.session.refresh(db_patient)
        return PatientResponseDTO(**db_patient.__dict__)

    def get_hospital_patients(self, hospital_id: int) -> List[PatientResponseDTO]:
        self.get_hospital_by_id(hospital_id)  # Verify hospital exists
        result = self.session.execute(select(Patient).where(Patient.hospital_id == hospital_id))
        patients = result.scalars().all()
        return [PatientResponseDTO(**p.__dict__) for p in patients] 