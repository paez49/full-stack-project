import { authService } from "../service/authService";
import { TOKEN_KEY } from "../constants/auth";

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 401 || response.status === 403) {
    authService.logout();
    window.location.href = "/login";
    throw new Error(
      response.status === 401 
        ? "Session expired. Please login again." 
        : "You don't have permission to access this resource."
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
} 