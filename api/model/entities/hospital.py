from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class Hospital(Base):
    __tablename__ = 'hospitals'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String)
    capacity = Column(Integer)

    patients = relationship("Patient", back_populates="hospital") 

    @property
    def current_patients(self):
        return len(self.patients)