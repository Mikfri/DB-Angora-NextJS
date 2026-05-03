// src/app/annoncer/raa-uld/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/heroui';
import WoolRawSaleList from './woolRawSaleList';
import { getWoolRawSaleItems } from '@/app/actions/sales/salesActions';
import { WoolRawSaleFilterDTO } from '@/api/types/WoolRawDTOs';
import BannerCard from '@/components/cards/bannerCard';
import SaleCategoryCards from '@/components/cards/saleCategoryCards';

type SearchParamsType = {
    FiberType?: string;
    NaturalColor?: string;
    MinFiberLengthCm?: string;
    MaxFiberLengthCm?: string;
    MinWeightGrams?: string;
    MaxWeightGrams?: string;
    City?: string;
    MinZipCode?: string;
    MaxZipCode?: string;
    MinPrice?: string;
    MaxPrice?: string;
    CanBeShipped?: string;
    SortBy?: string;
    Page?: string;
    PageSize?: string;
};

type RaaUldPageProps = {
    params: Promise<object>;
    searchParams?: Promise<SearchParamsType>;
};

export async function generateMetadata({ searchParams }: RaaUldPageProps): Promise<Metadata> {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;
    const { FiberType, NaturalColor } = params;

    const filterDesc: string[] = [];
    if (FiberType)     filterDesc.push(`Fiber: ${FiberType}`);
    if (NaturalColor)  filterDesc.push(`Farve: ${NaturalColor}`);

    const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

    return {
        title: `Rå uld til salg${filterString}`,
        description: `Find rå, ubehandlet angora-uld til salg på Den Blå Angora${filterString}`,
    };
}

function CenteredLoading() {
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-75">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" color="accent" />
                <p className="text-zinc-400">Henter rå uld...</p>
            </div>
        </div>
    );
}

async function ItemLoader({ searchParams }: { searchParams: RaaUldPageProps['searchParams'] }) {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;

    const {
        Page: pageParam,
        PageSize: pageSizeParam,
        FiberType,
        NaturalColor,
        MinFiberLengthCm,
        MaxFiberLengthCm,
        MinWeightGrams,
        MaxWeightGrams,
        MinZipCode,
        MaxZipCode,
        MinPrice,
        MaxPrice,
        CanBeShipped,
        SortBy,
        City,
    } = params;

    const page     = pageParam     ? parseInt(pageParam)     : 1;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 12;

    const filter: WoolRawSaleFilterDTO = {};

    if (FiberType)    filter.fiberType    = FiberType;
    if (NaturalColor) filter.naturalColor = NaturalColor;
    if (SortBy)       filter.sortBy       = SortBy;
    if (City)         filter.city         = City;
    if (CanBeShipped === 'true') filter.canBeShipped = true;

    if (MinFiberLengthCm) {
        const v = parseFloat(MinFiberLengthCm);
        if (!isNaN(v)) filter.minFiberLengthCm = v;
    }
    if (MaxFiberLengthCm) {
        const v = parseFloat(MaxFiberLengthCm);
        if (!isNaN(v)) filter.maxFiberLengthCm = v;
    }
    if (MinWeightGrams) {
        const v = parseFloat(MinWeightGrams);
        if (!isNaN(v)) filter.minWeightGrams = v;
    }
    if (MaxWeightGrams) {
        const v = parseFloat(MaxWeightGrams);
        if (!isNaN(v)) filter.maxWeightGrams = v;
    }
    if (MinZipCode) {
        const v = parseInt(MinZipCode);
        if (!isNaN(v)) filter.minZipCode = v;
    }
    if (MaxZipCode) {
        const v = parseInt(MaxZipCode);
        if (!isNaN(v)) filter.maxZipCode = v;
    }
    if (MinPrice) {
        const v = parseFloat(MinPrice);
        if (!isNaN(v)) filter.minPrice = v;
    }
    if (MaxPrice) {
        const v = parseFloat(MaxPrice);
        if (!isNaN(v)) filter.maxPrice = v;
    }

    const result = await getWoolRawSaleItems(filter, page, pageSize);

    if (!result.success) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
                <p className="text-zinc-400">Der opstod en fejl: {result.error}</p>
            </div>
        );
    }

    return (
        <WoolRawSaleList
            items={result.data.data}
            paging={{
                currentPage:     result.data.page,
                pageSize:        result.data.pageSize,
                totalCount:      result.data.totalCount,
                totalPages:      result.data.totalPages,
                hasNextPage:     result.data.hasNextPage,
                hasPreviousPage: result.data.hasPreviousPage,
            }}
        />
    );
}

export default async function Page({ searchParams }: RaaUldPageProps) {
    return (
        <div className="space-y-6">
            <BannerCard
                title="Rå uld til salg"
                description="Udforsk rå, ubehandlet angora-uld fra passionerede avlere i hele Danmark."
                imageSrc="/images/sideNavigationCard_MySales.png"
                imageAlt="Rå uld til salg fra DB-Angora"
            />

            <SaleCategoryCards />

            <Suspense fallback={<CenteredLoading />}>
                <ItemLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
