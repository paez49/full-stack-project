from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from .base import Base

class Patient(Base):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    onconlogical= Column(Boolean)
    birth_date= Column(Date)
    hospital_id = Column(Integer, ForeignKey('hospitals.id'), nullable=True)

    hospital = relationship("Hospital", back_populates="patients")
