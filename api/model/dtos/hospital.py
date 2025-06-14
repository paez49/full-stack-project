from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class HospitalBase(BaseModel):
    name: str
    address: str
    capacity: int

class HospitalDTO(HospitalBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True
        
class HospitalUpdateDTO(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    capacity: Optional[int] = None
    
class HospitalCreateDTO(HospitalBase):
    pass

class HospitalResponseDTO(HospitalBase):
    id: int

    class Config:
        orm_mode = True

