import pytest
from fastapi import HTTPException
from service.patient_service import PatientService
from model.dtos.patient import PatientCreateDTO, PatientUpdateDTO
from model.entities.patient import Patient, CancerType
from datetime import date

@pytest.fixture
def patient_service(db_session):
    service = PatientService()
    service.session = db_session
    return service

def test_create_patient_success(patient_service):
    # Arrange
    patient_data = PatientCreateDTO(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20),
        cancer_type=None
    )

    # Act
    result = patient_service.create_patient(patient_data)

    # Assert
    assert result.name == patient_data.name
    assert result.age == patient_data.age
    assert result.oncological == patient_data.oncological
    assert result.cancer_type == patient_data.cancer_type
    assert result.birth_date == patient_data.birth_date

def test_create_patient_invalid_oncological_data(patient_service):
    # Arrange
    patient_data = PatientCreateDTO(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20),
        cancer_type=CancerType.breast  # This should raise an error
    )

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        patient_service.create_patient(patient_data)
    assert exc_info.value.status_code == 400
    assert "cancer_type must be null when oncological is False" in str(exc_info.value.detail)

def test_get_all_patients(patient_service):
    # Arrange
    patient1 = Patient(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20)
    )
    patient2 = Patient(
        name="Jane Doe",
        age=25,
        oncological=True,
        birth_date=date(1998, 5, 20),
        cancer_type=CancerType.breast
    )
    patient_service.session.add_all([patient1, patient2])
    patient_service.session.commit()

    # Act
    result = patient_service.get_all_patients()

    # Assert
    assert len(result) == 2
    assert result[0].name == "John Doe"
    assert result[1].name == "Jane Doe"

def test_get_patient_by_id_success(patient_service):
    # Arrange
    patient = Patient(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20)
    )
    patient_service.session.add(patient)
    patient_service.session.commit()

    # Act
    result = patient_service.get_patient_by_id(patient.id)

    # Assert
    assert result.name == "John Doe"
    assert result.age == 30

def test_get_patient_by_id_not_found(patient_service):
    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        patient_service.get_patient_by_id(999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Patient not found"

def test_update_patient_success(patient_service):
    # Arrange
    patient = Patient(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20)
    )
    patient_service.session.add(patient)
    patient_service.session.commit()

    update_data = PatientUpdateDTO(
        name="John Updated",
        age=31
    )

    # Act
    result = patient_service.update_patient(patient.id, update_data)

    # Assert
    assert result.name == "John Updated"
    assert result.age == 31

def test_delete_patient_success(patient_service):
    # Arrange
    patient = Patient(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20)
    )
    patient_service.session.add(patient)
    patient_service.session.commit()

    # Act
    result = patient_service.delete_patient(patient.id)

    # Assert
    assert result is True
    with pytest.raises(HTTPException) as exc_info:
        patient_service.get_patient_by_id(patient.id)
    assert exc_info.value.status_code == 404 