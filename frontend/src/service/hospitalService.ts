const API_BASE_URL = 'http://localhost:8000';
import type { Hospital, HospitalCreateDTO, HospitalUpdateDTO } from "../types/hospital"
import { fetchWithAuth, handleApiResponse } from "../utils/api"
import type { Patient } from "../types/patient"

class HospitalAPI {
    async getAllHospitals(): Promise<Hospital[]> {
        const response = await fetchWithAuth(`${API_BASE_URL}/hospitals`)
        return handleApiResponse<Hospital[]>(response)
    }

    async getHospital(id: number): Promise<Hospital> {
        const response = await fetchWithAuth(`${API_BASE_URL}/hospitals/${id}`)
        return handleApiResponse<Hospital>(response)
    }

    async createHospital(hospital: HospitalCreateDTO): Promise<Hospital> {
        const response = await fetchWithAuth(`${API_BASE_URL}/hospitals`, {
            method: "POST",
            body: JSON.stringify(hospital),
        })
        return handleApiResponse<Hospital>(response)
    }

    async updateHospital(id: number, hospital: HospitalUpdateDTO): Promise<Hospital> {
        const response = await fetchWithAuth(`${API_BASE_URL}/hospitals/${id}`, {
            method: "PUT",
            body: JSON.stringify(hospital),
        })
        return handleApiResponse<Hospital>(response)
    }

    async deleteHospital(id: number): Promise<void> {
        const response = await fetchWithAuth(`${API_BASE_URL}/hospitals/${id}`, {
            method: "DELETE",
        })
        if (!response.ok) {
            await handleApiResponse(response)
        }
    }

    async assignPatientToHospital(hospitalId: number, patientId: number): Promise<Patient> {
        const response = await fetchWithAuth(`${API_BASE_URL}/hospitals/${hospitalId}/patients/${patientId}`, {
            method: "POST",
        })
        return handleApiResponse<Patient>(response)
    }
}

export const hospitalAPI = new HospitalAPI() 