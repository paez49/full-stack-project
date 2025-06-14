import { TOKEN_KEY } from "../constants/auth";
import { fetchWithAuth, handleApiResponse } from "../utils/api"

import type { Patient } from "../types/patient"

class AuthService {
  async login(email: string, password: string): Promise<void> {
    const response = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}

export const authService = new AuthService();

export const getHospitalPatients = async (hospitalId: number): Promise<Patient[]> => {
  const response = await fetchWithAuth(`http://localhost:8000/hospitals/${hospitalId}/patients`)
  return handleApiResponse<Patient[]>(response)
}
