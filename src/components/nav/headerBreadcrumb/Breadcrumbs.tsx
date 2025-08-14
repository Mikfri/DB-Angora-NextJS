// src/components/header/pageHeader.tsx
'use client'
import { usePathname } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { topNavigationLinks } from '@/constants/navigationConstants';

// Byg pageTitles dynamisk fra navigation-links
const pageTitles: Record<string, string> = Object.fromEntries(
  topNavigationLinks[0].links.map(link => [link.href, link.label])
);

pageTitles['/'] = 'Forside'; // Tilføj forsiden

export default function PageHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = pathSegments.reduce((acc, segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = pageTitles[path] || segment;

    if (label) {
      acc.push({
        path,
        label
      });
    }
    return acc;
  }, [{ path: '/', label: pageTitles['/'] }]);

  return (
    <div className="w-full py-2">
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
            href={item.path}
          >
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}