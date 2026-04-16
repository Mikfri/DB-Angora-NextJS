// src/app/annoncer/salePageContent.tsx
import SaleCategoryCards from '@/components/cards/saleCategoryCards';
import SaleItemsList from './saleItemsList';
import { getAllSaleItemsFiltered } from '@/app/actions/sales/salesActions';
import { SaleDetailsFilterDTO } from '@/api/types/AngoraDTOs';
import BannerCard from '@/components/cards/bannerCard';

type SearchParamsType = {
    EntityType?: string;
    MinPrice?: string;
    MaxPrice?: string;
    CanBeShipped?: string;
    City?: string;
    MinZipCode?: string;
    MaxZipCode?: string;
    SortBy?: string;
    Page?: string;
    PageSize?: string;
};

interface Props {
    searchParams?: Promise<SearchParamsType>;
}

export default async function SalePageContent({ searchParams }: Props) {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;

    const {
        EntityType,
        MinPrice,
        MaxPrice,
        CanBeShipped,
        City,
        MinZipCode,
        MaxZipCode,
        SortBy,
        Page: pageParam,
        PageSize: pageSizeParam,
    } = params;

    const page = pageParam ? parseInt(pageParam) : 1;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 12;

    const filter: SaleDetailsFilterDTO = {};

    if (EntityType) filter.entityType = EntityType;
    if (City) filter.city = City;
    if (SortBy) filter.sortBy = SortBy;

    if (MinPrice) {
        const v = parseFloat(MinPrice);
        if (!isNaN(v)) filter.minPrice = v;
    }
    if (MaxPrice) {
        const v = parseFloat(MaxPrice);
        if (!isNaN(v)) filter.maxPrice = v;
    }
    if (MinZipCode) {
        const v = parseInt(MinZipCode);
        if (!isNaN(v)) filter.minZipCode = v;
    }
    if (MaxZipCode) {
        const v = parseInt(MaxZipCode);
        if (!isNaN(v)) filter.maxZipCode = v;
    }
    if (CanBeShipped !== undefined) {
        filter.canBeShipped = CanBeShipped === 'true';
    }

    const result = await getAllSaleItemsFiltered(filter, page, pageSize);

    if (!result.success) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
                <p className="text-red-500">Der opstod en fejl: {result.error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BannerCard
                title="Til salg"
                description="Find kaniner, uld, garn og skind fra passionerede angora-avlere i hele Danmark."
                imageSrc="/images/sideNavigationCard_MySales.png"
                imageAlt="Varer til salg fra DB-Angora"
            />

            <SaleCategoryCards />

            <SaleItemsList
                items={result.data.data}
                paging={{
                    currentPage: result.data.page,
                    pageSize: result.data.pageSize,
                    totalCount: result.data.totalCount,
                    totalPages: result.data.totalPages,
                    hasNextPage: result.data.hasNextPage,
                    hasPreviousPage: result.data.hasPreviousPage,
                }}
            />
        </div>
    );
}

