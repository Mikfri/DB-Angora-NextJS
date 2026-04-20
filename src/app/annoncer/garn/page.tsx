// src/app/annoncer/garn/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/heroui';
import YarnSaleList from './yarnSaleList';
import { getYarnSaleItems } from '@/app/actions/sales/salesActions';
import { YarnSaleFilterDTO } from '@/api/types/YarnDTOs';
import BannerCard from '@/components/cards/bannerCard';
import SaleCategoryCards from '@/components/cards/saleCategoryCards';

type SearchParamsType = {
    ApplicationCategory?: string;
    WeightCategory?: string;
    FiberType?: string;
    PlyCount?: string;
    MinNeedleSizeMm?: string;
    MaxNeedleSizeMm?: string;
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

type GarnPageProps = {
    params: Promise<object>;
    searchParams?: Promise<SearchParamsType>;
};

export async function generateMetadata({ searchParams }: GarnPageProps): Promise<Metadata> {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;
    const { ApplicationCategory, WeightCategory, FiberType } = params;

    const filterDesc: string[] = [];
    if (ApplicationCategory) filterDesc.push(`Kategori: ${ApplicationCategory}`);
    if (WeightCategory)      filterDesc.push(`Tykkelse: ${WeightCategory}`);
    if (FiberType)           filterDesc.push(`Fiber: ${FiberType}`);

    const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

    return {
        title: `Garn til salg${filterString}`,
        description: `Find angora-garn til salg på Den Blå Angora${filterString}`,
    };
}

function CenteredLoading() {
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-75">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" color="accent" />
                <p className="text-zinc-400">Henter garn...</p>
            </div>
        </div>
    );
}

async function ItemLoader({ searchParams }: { searchParams: GarnPageProps['searchParams'] }) {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;

    const {
        Page: pageParam,
        PageSize: pageSizeParam,
        ApplicationCategory,
        WeightCategory,
        FiberType,
        PlyCount,
        MinNeedleSizeMm,
        MaxNeedleSizeMm,
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

    const filter: YarnSaleFilterDTO = {};

    if (ApplicationCategory) filter.applicationCategory = ApplicationCategory;
    if (WeightCategory)      filter.weightCategory      = WeightCategory;
    if (FiberType)           filter.fiberType           = FiberType;
    if (SortBy)              filter.sortBy              = SortBy;
    if (City)                filter.city                = City;
    if (CanBeShipped === 'true') filter.canBeShipped    = true;

    if (PlyCount) {
        const v = parseInt(PlyCount);
        if (!isNaN(v)) filter.plyCount = v;
    }
    if (MinNeedleSizeMm) {
        const v = parseFloat(MinNeedleSizeMm);
        if (!isNaN(v)) filter.minNeedleSizeMm = v;
    }
    if (MaxNeedleSizeMm) {
        const v = parseFloat(MaxNeedleSizeMm);
        if (!isNaN(v)) filter.maxNeedleSizeMm = v;
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

    const result = await getYarnSaleItems(filter, page, pageSize);

    if (!result.success) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
                <p className="text-zinc-400">Der opstod en fejl: {result.error}</p>
            </div>
        );
    }

    return (
        <YarnSaleList
            items={result.data.data}
            paging={{
                currentPage:      result.data.page,
                pageSize:         result.data.pageSize,
                totalCount:       result.data.totalCount,
                totalPages:       result.data.totalPages,
                hasNextPage:      result.data.hasNextPage,
                hasPreviousPage:  result.data.hasPreviousPage,
            }}
        />
    );
}

export default async function Page({ searchParams }: GarnPageProps) {
    return (
        <div className="space-y-6">
            <BannerCard
                title="Garn til salg"
                description="Udforsk håndspundet og forarbejdet angora-garn fra passionerede avlere i hele Danmark."
                imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
                imageAlt="Garn til salg fra DB-Angora"
            />

            <SaleCategoryCards />

            <Suspense fallback={<CenteredLoading />}>
                <ItemLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

