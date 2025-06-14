from pydantic import BaseModel
from typing import Optional


class PatientBaseDTO(BaseModel):
    name: str
    age: int

class PatientCreateDTO(PatientBaseDTO):
    pass

class PatientUpdateDTO(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None

class PatientResponseDTO(PatientBaseDTO):
    id: int
    hospital_id: Optional[int] = None 
    name: str
    age: int

    class Config:
        orm_mode = True