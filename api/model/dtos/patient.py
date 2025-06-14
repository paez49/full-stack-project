from pydantic import BaseModel
from typing import Optional
from datetime import date

from model.entities.patient import CancerType

class PatientBaseDTO(BaseModel):
    name: str
    age: int
    oncological:bool
    birth_date:date
    cancer_type: Optional[CancerType] = None

class PatientCreateDTO(PatientBaseDTO):
    pass

class PatientUpdateDTO(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    oncological:Optional[bool] = None
    birth_date:Optional[date]= None
    cancer_type: Optional[CancerType] = None

class PatientResponseDTO(PatientBaseDTO):
    id: int
    hospital_id: Optional[int] = None 
    name: str
    age: int
    oncological:bool
    birth_date:date
    cancer_type: Optional[CancerType] 

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 1,
                "name": "John Doe",
                "age": 30,
                "hospital_id": 2,
                "oncological": True,
                "birth_date": "1993-05-20"
            }
        }