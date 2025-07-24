// src/api/endpoints/authController.ts
import { getApiUrl } from "../config/apiConfig";
import { LoginResponseDTO } from "../types/AngoraDTOs";

export async function Login(userName: string, password: string): Promise<LoginResponseDTO> {
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