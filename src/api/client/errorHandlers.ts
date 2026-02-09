// src/api/client/errorHandlers.ts

export type ApiValidationError = {
  type?: string;
  title?: string;
  status?: number;
  traceId?: string;
  errors?: Record<string, string[]>;
  message?: string;
};

/**
 * Parser API-fejl fra en Response, forsøger at udtrække meningsfulde fejlbeskeder,
 *  fra både standardiserede og ikke-standardiserede svar.
 * @param response 
 * @param customPrefix 
 * @returns 
 */
export async function parseApiError(response: Response, customPrefix?: string): Promise<Error> {
  const text = await response.text();
  let msg = `${response.status} ${response.statusText}`;
  try {
    const p = JSON.parse(text) as ApiValidationError;
    if (p?.errors) {
      msg = Object.values(p.errors).flat().join(', ');
    } else if (p?.message) {
      msg = p.message;
    }
  } catch {
    if (text && text.trim()) msg = text;
  }
  const finalMsg = customPrefix ? `${customPrefix}: ${msg}` : msg;
  console.error('API Error', { status: response.status, body: text });
  return new Error(finalMsg);
}