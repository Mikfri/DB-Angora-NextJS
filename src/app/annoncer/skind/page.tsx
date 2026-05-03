// src/app/annoncer/skind/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/heroui';
import PeltSaleList from './peltSaleList';
import { getPeltSaleItems } from '@/app/actions/sales/salesActions';
import { PeltSaleFilterDTO } from '@/api/types/PeltDTOs';
import BannerCard from '@/components/cards/bannerCard';
import SaleCategoryCards from '@/components/cards/saleCategoryCards';

type SearchParamsType = {
    Race?: string;
    Color?: string;
    TanningMethod?: string;
    Condition?: string;
    MinLengthCm?: string;
    MaxLengthCm?: string;
    MinWidthCm?: string;
    MaxWidthCm?: string;
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

type SkindPageProps = {
    params: Promise<object>;
    searchParams?: Promise<SearchParamsType>;
};

export async function generateMetadata({ searchParams }: SkindPageProps): Promise<Metadata> {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;
    const { Race, Color, Condition } = params;

    const filterDesc: string[] = [];
    if (Race)      filterDesc.push(`Race: ${Race}`);
    if (Color)     filterDesc.push(`Farve: ${Color}`);
    if (Condition) filterDesc.push(`Stand: ${Condition}`);

    const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

    return {
        title: `Kaninskind til salg${filterString}`,
        description: `Find garvede kaninskind til salg fra avlere i Danmark${filterString}`,
    };
}

function CenteredLoading() {
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-75">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" color="accent" />
                <p className="text-zinc-400">Henter skind...</p>
            </div>
        </div>
    );
}

async function ItemLoader({ searchParams }: { searchParams: SkindPageProps['searchParams'] }) {
    const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;

    const {
        Page: pageParam,
        PageSize: pageSizeParam,
        Race,
        Color,
        TanningMethod,
        Condition,
        MinLengthCm,
        MaxLengthCm,
        MinWidthCm,
        MaxWidthCm,
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

    const filter: PeltSaleFilterDTO = {};

    if (Race)          filter.race          = Race;
    if (Color)         filter.color         = Color;
    if (TanningMethod) filter.tanningMethod = TanningMethod;
    if (Condition)     filter.condition     = Condition;
    if (SortBy)        filter.sortBy        = SortBy;
    if (City)          filter.city          = City;
    if (CanBeShipped === 'true') filter.canBeShipped = true;

    if (MinLengthCm) {
        const v = parseFloat(MinLengthCm);
        if (!isNaN(v)) filter.minLengthCm = v;
    }
    if (MaxLengthCm) {
        const v = parseFloat(MaxLengthCm);
        if (!isNaN(v)) filter.maxLengthCm = v;
    }
    if (MinWidthCm) {
        const v = parseFloat(MinWidthCm);
        if (!isNaN(v)) filter.minWidthCm = v;
    }
    if (MaxWidthCm) {
        const v = parseFloat(MaxWidthCm);
        if (!isNaN(v)) filter.maxWidthCm = v;
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

    const result = await getPeltSaleItems(filter, page, pageSize);

    if (!result.success) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
                <p className="text-zinc-400">Der opstod en fejl: {result.error}</p>
            </div>
        );
    }

    return (
        <PeltSaleList
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

export default async function Page({ searchParams }: SkindPageProps) {
    return (
        <div className="space-y-6">
            <BannerCard
                title="Kaninskind til salg"
                description="Udforsk garvede kaninskind fra passionerede avlere i hele Danmark."
                imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
                imageAlt="Kaninskind til salg fra DB-Angora"
            />

            <SaleCategoryCards />

            <Suspense fallback={<CenteredLoading />}>
                <ItemLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
