// src/api/types/AngoraDTOs.ts
// Barrel re-export — importér direkte fra de respektive filer for bedre overblik.

export * from './ApplicationDTOs';
export * from './AuthDTOs';
export * from './PhotoDTOs';
export * from './BreederAccountDTOs';
export * from './UserDTOs';
export * from './RabbitDTOs';
export * from './RabbitSaleDTOs';
export * from './PedigreeDTOs';
export * from './SaleDetailsDTOs';
export * from './TransferRequestDTOs';
export * from './BlogDTOs';


/**
 * Generisk DTO til paginerede resultater.
 * @template T Typen af data i resultatet
 */
export interface ResultPagedDTO<T> {
    /** Array af data af typen T */
    data: T[];
    /** Totalt antal elementer på tværs af alle sider */
    totalCount: number;
    /** Nuværende side (1-baseret) */
    page: number;
    /** Antal elementer per side */
    pageSize: number;
    /** Totalt antal sider */
    totalPages: number;
    /** Om der findes en næste side */
    hasNextPage: boolean;
    /** Om der findes en tidligere side */
    hasPreviousPage: boolean;
}
