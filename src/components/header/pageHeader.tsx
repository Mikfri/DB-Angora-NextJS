// src/components/header/pageHeader.tsx
'use client'
import { usePathname } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

const pageTitles: Record<string, string> = {
  '/': 'Forside',
  '/account': 'Min side',
  '/account/profile': 'Min profil',
  '/account/rabbitsForbreeding': 'Find avlskaniner',
  '/account/myRabbits': 'Mine kaniner',
  '/account/myRabbits/create': 'Opret kanin',
  '/account/myRabbits/rabbitProfile': 'Kanin profil',
  '/sale': 'Salg',
  '/sale/rabbits': 'Kaniner til salg',
  '/sale/rabbits/profile': 'Kanin profil',
};

export default function PageHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // Byg breadcrumb items
  const breadcrumbItems = pathSegments.reduce((acc, segment, index) => {
    // Skip rabbit ID segments
    if (segment.match(/^([A-Z]?\d{2,4}-\d{3,6}|\d+)$/)) {
      return acc;
    }

    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = pageTitles[path] || segment;
    const isProfilePage = segment === 'rabbitProfile';

    // Kun tilføj hvis vi har en valid label
    if (label) {
      acc.push({
        path,
        label,
        isProfilePage
      });
    }

    return acc;
  }, [{ path: '/', label: 'Forside', isProfilePage: false }]);

  return (
    <Breadcrumbs
      className="text-sm"
      classNames={{
        list: "gap-2",
        base: "text-zinc-300 hover:text-zinc-100",
        separator: "mx-2 text-zinc-500"
      }}
    >
      {breadcrumbItems.map((item) => (
        <BreadcrumbItem
          key={item.path}
          href={item.isProfilePage ? undefined : item.path}
          isDisabled={item.isProfilePage}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}