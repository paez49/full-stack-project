import pytest
from fastapi import HTTPException
from service.hospital_service import HospitalService
from model.dtos.hospital import HospitalCreateDTO, HospitalUpdateDTO
from model.entities.hospital import Hospital
from model.entities.patient import Patient
from datetime import date

@pytest.fixture
def hospital_service(db_session):
    service = HospitalService()
    service.session = db_session
    return service

def test_create_hospital_success(hospital_service):
    # Arrange
    hospital_data = HospitalCreateDTO(
        name="Test Hospital",
        address="123 Test St",
        capacity=100
    )

    # Act
    result = hospital_service.create_hospital(hospital_data)

    # Assert
    assert result.name == hospital_data.name
    assert result.address == hospital_data.address
    assert result.capacity == hospital_data.capacity

def test_get_all_hospitals(hospital_service):
    # Arrange
    hospital1 = Hospital(name="Hospital 1", address="Address 1", capacity=50)
    hospital2 = Hospital(name="Hospital 2", address="Address 2", capacity=75)
    hospital_service.session.add_all([hospital1, hospital2])
    hospital_service.session.commit()

    # Act
    result = hospital_service.get_all_hospitals()

    # Assert
    assert len(result) == 2
    assert result[0].name == "Hospital 1"
    assert result[1].name == "Hospital 2"

def test_get_hospital_by_id_success(hospital_service):
    # Arrange
    hospital = Hospital(name="Test Hospital", address="Test Address", capacity=100)
    hospital_service.session.add(hospital)
    hospital_service.session.commit()

    # Act
    result = hospital_service.get_hospital_by_id(hospital.id)

    # Assert
    assert result.name == "Test Hospital"
    assert result.capacity == 100

def test_get_hospital_by_id_not_found(hospital_service):
    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        hospital_service.get_hospital_by_id(999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Hospital not found"

def test_update_hospital_success(hospital_service):
    # Arrange
    hospital = Hospital(name="Original Name", address="Original Address", capacity=50)
    hospital_service.session.add(hospital)
    hospital_service.session.commit()

    update_data = HospitalUpdateDTO(
        name="Updated Name",
        capacity=75
    )

    # Act
    result = hospital_service.update_hospital(hospital.id, update_data)

    # Assert
    assert result.name == "Updated Name"
    assert result.capacity == 75
    assert result.address == "Original Address"  # Unchanged field

def test_delete_hospital_success(hospital_service):
    # Arrange
    hospital = Hospital(name="Test Hospital", address="Test Address", capacity=100)
    hospital_service.session.add(hospital)
    hospital_service.session.commit()

    # Act
    result = hospital_service.delete_hospital(hospital.id)

    # Assert
    assert result is True
    with pytest.raises(HTTPException) as exc_info:
        hospital_service.get_hospital_by_id(hospital.id)
    assert exc_info.value.status_code == 404

def test_add_patient_to_hospital_success(hospital_service):
    # Arrange
    hospital = Hospital(name="Test Hospital", address="Test Address", capacity=100)
    patient = Patient(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20)
    )
    hospital_service.session.add_all([hospital, patient])
    hospital_service.session.commit()

    # Act
    result = hospital_service.add_patient_to_hospital(hospital.id, patient.id)

    # Assert
    assert result.hospital_id == hospital.id
    assert len(hospital.patients) == 1

def test_add_patient_to_hospital_capacity_reached(hospital_service):
    # Arrange
    hospital = Hospital(name="Test Hospital", address="Test Address", capacity=1)
    patient1 = Patient(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20)
    )
    patient2 = Patient(
        name="Jane Doe",
        age=25,
        oncological=False,
        birth_date=date(1998, 5, 20)
    )
    hospital_service.session.add_all([hospital, patient1, patient2])
    hospital_service.session.commit()
    
    # Add first patient
    hospital_service.add_patient_to_hospital(hospital.id, patient1.id)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        hospital_service.add_patient_to_hospital(hospital.id, patient2.id)
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "The hospital reached its maximum capacity"

def test_get_hospital_patients(hospital_service):
    # Arrange
    hospital = Hospital(name="Test Hospital", address="Test Address", capacity=100)
    patient1 = Patient(
        name="John Doe",
        age=30,
        oncological=False,
        birth_date=date(1993, 5, 20)
    )
    patient2 = Patient(
        name="Jane Doe",
        age=25,
        oncological=False,
        birth_date=date(1998, 5, 20)
    )
    hospital_service.session.add_all([hospital, patient1, patient2])
    hospital_service.session.commit()

    # Add patients to hospital
    hospital_service.add_patient_to_hospital(hospital.id, patient1.id)
    hospital_service.add_patient_to_hospital(hospital.id, patient2.id)

    # Act
    result = hospital_service.get_hospital_patients(hospital.id)

    # Assert
    assert len(result) == 2
    assert result[0].name == "John Doe"
    assert result[1].name == "Jane Doe" 