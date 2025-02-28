import { getApiUrl } from "../config/apiConfig";
import { LoginResponse } from "../types/AngoraDTOs";

export async function Login(userName: string, password: string): Promise<LoginResponse> {
    const response = await fetch(getApiUrl('Auth/Login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password, rememberMe: false })
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
    }

    return response.json();
}