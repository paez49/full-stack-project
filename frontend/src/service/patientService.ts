import type { Patient, PatientCreateDTO, PatientUpdateDTO } from "../types/patient"
import { fetchWithAuth, handleApiResponse } from "../utils/api"

const API_BASE_URL = "http://localhost:8000"

class PatientAPI {  

  async getAllPatients(): Promise<Patient[]> {
    const response = await fetchWithAuth(`${API_BASE_URL}/patients`)
    return handleApiResponse<Patient[]>(response)
  }

  async getPatient(id: number): Promise<Patient> {
    const response = await fetchWithAuth(`${API_BASE_URL}/patients/${id}`)
    return handleApiResponse<Patient>(response)
  }

  async createPatient(patient: PatientCreateDTO): Promise<Patient> {
    const response = await fetchWithAuth(`${API_BASE_URL}/patients`, {
      method: "POST",
      body: JSON.stringify(patient),
    })
    return handleApiResponse<Patient>(response)
  }

  async updatePatient(id: number, patient: PatientUpdateDTO): Promise<Patient> {
    const response = await fetchWithAuth(`${API_BASE_URL}/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(patient),
    })
    return handleApiResponse<Patient>(response)
  }

  async deletePatient(id: number): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/patients/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      await handleApiResponse(response)
    }
  }
}

export const patientAPI = new PatientAPI()
