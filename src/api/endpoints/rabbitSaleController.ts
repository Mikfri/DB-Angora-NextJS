// src/api/endpoints/rabbitSaleController.ts
import { parseApiError } from "../client/errorHandlers";
import { getApiUrl } from "../config/apiConfig";
import { RabbitPostPutSaleDetailsDTO, RabbitSaleProfilePrivateDTO } from "../types/RabbitSaleDTOs";

const rabbitSaleUrl = (id?: number) =>
    getApiUrl(`RabbitSale${id != null ? `/${id}` : ''}`);

export async function CreateRabbitSaleDetails(
    earCombId: string,
    createDto: RabbitPostPutSaleDetailsDTO,
    accessToken: string
): Promise<RabbitSaleProfilePrivateDTO> {
    const response = await fetch(getApiUrl(`RabbitSale/${encodeURIComponent(earCombId)}`), {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(createDto)
    });
    if (!response.ok) throw await parseApiError(response, "Kunne ikke oprette kanin-salgsannonce");
    const payload = await response.json();
    return payload?.data ?? payload;
}

export async function GetRabbitSaleDetails(
    id: number,
    accessToken: string
): Promise<RabbitSaleProfilePrivateDTO> {
    const response = await fetch(rabbitSaleUrl(id), {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json"
        }
    });
    if (!response.ok) throw await parseApiError(response, "Kunne ikke hente kanin-salgsprofil");
    const payload = await response.json();
    return payload?.data ?? payload;
}

export async function UpdateRabbitSaleDetails(
    id: number,
    updateDto: RabbitPostPutSaleDetailsDTO,
    accessToken: string
): Promise<RabbitSaleProfilePrivateDTO> {
    const response = await fetch(rabbitSaleUrl(id), {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updateDto)
    });
    if (!response.ok) throw await parseApiError(response, "Kunne ikke opdatere kanin-salgsannonce");
    const payload = await response.json();
    return payload?.data ?? payload;
}

export async function DeleteRabbitSaleDetails(
    id: number,
    accessToken: string
): Promise<boolean> {
    const response = await fetch(rabbitSaleUrl(id), {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json"
        }
    });
    if (!response.ok) throw await parseApiError(response, "Kunne ikke slette kanin-salgsannonce");
    const data = await response.json().catch(() => null);
    return data?.data ?? true;
}
