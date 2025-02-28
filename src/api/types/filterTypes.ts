// src/api/types/filterTypes.ts
export interface ForSaleFilters {
    RightEarId: string | null;
    BornAfter: string | null;
    MinZipCode: number | null;
    MaxZipCode: number | null;
    Race: string | null;
    Color: string | null;
    Gender: string | null;
}