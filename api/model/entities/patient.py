from enum import Enum
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date, CheckConstraint
from sqlalchemy import Enum as SqlEnum 
from sqlalchemy.orm import relationship

class CancerType(str, Enum):
    breast = "Breast"
    lung = "Lung"
    colon = "Colon"
    prostate = "Prostate"
    skin = "Skin"

from .base import Base

class Patient(Base):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    oncological = Column(Boolean, nullable=False)
    birth_date = Column(Date)
    hospital_id = Column(Integer, ForeignKey('hospitals.id'), nullable=True)
    cancer_type = Column(SqlEnum(CancerType), nullable=True)

    hospital = relationship("Hospital", back_populates="patients")

    __table_args__ = (
        CheckConstraint(
            "(oncological = TRUE AND cancer_type IS NOT NULL) OR (oncological = FALSE AND cancer_type IS NULL)",
            name="check_oncological_cancer_type"
        ),
    )