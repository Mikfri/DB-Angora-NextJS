// src/app/annoncer/kartet-uld/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/heroui';
import WoolCardedSaleList from './woolCardedSaleList';
import { getWoolCardedSaleItems } from '@/app/actions/sales/salesActions';
import { WoolCardedSaleFilterDTO } from '@/api/types/WoolCardedDTOs';
import BannerCard from '@/components/cards/bannerCard';
import SaleCategoryCards from '@/components/cards/saleCategoryCards';

type SearchParamsType = {
    FiberType?: string;
    NaturalColor?: string;
    DyedColor?: string;
    IsDyed?: string;
    MinAverageFiberLengthCm?: string;
    MaxAverageFiberLengthCm?: string;
    MinTotalWeightGrams?: string;
    MaxTotalWeightGrams?: string;
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

type KartetUldPageProps = {
    params: Promise<object>;
    searchParams?: Promise<SearchParamsType>;
};

export async function generateMetadata({ searchParams }: KartetUldPageProps): Promise<Metadata> {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;
    const { FiberType, NaturalColor, DyedColor } = params;

    const filterDesc: string[] = [];
    if (FiberType)    filterDesc.push(`Fiber: ${FiberType}`);
    if (NaturalColor) filterDesc.push(`Farve: ${NaturalColor}`);
    if (DyedColor)    filterDesc.push(`Farvet: ${DyedColor}`);

    const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

    return {
        title: `Kartet uld til salg${filterString}`,
        description: `Find kartet angora-uld til salg fra avlere i Danmark${filterString}`,
    };
}

function CenteredLoading() {
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-75">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" color="accent" />
                <p className="text-zinc-400">Henter kartet uld...</p>
            </div>
        </div>
    );
}

async function ItemLoader({ searchParams }: { searchParams: KartetUldPageProps['searchParams'] }) {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;

    const {
        Page: pageParam,
        PageSize: pageSizeParam,
        FiberType,
        NaturalColor,
        DyedColor,
        IsDyed,
        MinAverageFiberLengthCm,
        MaxAverageFiberLengthCm,
        MinTotalWeightGrams,
        MaxTotalWeightGrams,
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

    const filter: WoolCardedSaleFilterDTO = {};

    if (FiberType)    filter.fiberType    = FiberType;
    if (NaturalColor) filter.naturalColor = NaturalColor;
    if (DyedColor)    filter.dyedColor    = DyedColor;
    if (IsDyed === 'true')  filter.isDyed = true;
    if (IsDyed === 'false') filter.isDyed = false;
    if (SortBy)       filter.sortBy       = SortBy;
    if (City)         filter.city         = City;
    if (CanBeShipped === 'true') filter.canBeShipped = true;

    if (MinAverageFiberLengthCm) {
        const v = parseFloat(MinAverageFiberLengthCm);
        if (!isNaN(v)) filter.minAverageFiberLengthCm = v;
    }
    if (MaxAverageFiberLengthCm) {
        const v = parseFloat(MaxAverageFiberLengthCm);
        if (!isNaN(v)) filter.maxAverageFiberLengthCm = v;
    }
    if (MinTotalWeightGrams) {
        const v = parseFloat(MinTotalWeightGrams);
        if (!isNaN(v)) filter.minTotalWeightGrams = v;
    }
    if (MaxTotalWeightGrams) {
        const v = parseFloat(MaxTotalWeightGrams);
        if (!isNaN(v)) filter.maxTotalWeightGrams = v;
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

    const result = await getWoolCardedSaleItems(filter, page, pageSize);

    if (!result.success) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
                <p className="text-zinc-400">Der opstod en fejl: {result.error}</p>
            </div>
        );
    }

    return (
        <WoolCardedSaleList
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

export default async function Page({ searchParams }: KartetUldPageProps) {
    return (
        <div className="space-y-6">
            <BannerCard
                title="Kartet uld til salg"
                description="Udforsk kartet angora-uld fra passionerede avlere i hele Danmark."
                imageSrc="/images/sideNavigationCard_MySales.png"
                imageAlt="Kartet uld til salg fra DB-Angora"
            />

            <SaleCategoryCards />

            <Suspense fallback={<CenteredLoading />}>
                <ItemLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

