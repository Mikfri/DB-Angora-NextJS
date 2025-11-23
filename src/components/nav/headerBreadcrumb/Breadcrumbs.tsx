// src/components/header/pageHeader.tsx
'use client'
import { usePathname } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { topNavigationLinks } from '@/constants/navigationConstants';

const pageTitles: Record<string, string> = Object.fromEntries(
  topNavigationLinks[0].links.map(link => [link.href, link.label])
);

pageTitles['/'] = 'Forside';

export default function PageHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = pathSegments.reduce((acc, segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = pageTitles[path] || segment;

    if (label) {
      acc.push({ path, label });
    }
    return acc;
  }, [{ path: '/', label: pageTitles['/'] }]);

  return (
    <div className="breadcrumb-container">
      <Breadcrumbs
        classNames={{
          list: "gap-2",
          separator: "breadcrumb-separator"
        }}
      >
        {breadcrumbItems.map((item) => (
          <BreadcrumbItem
            key={item.path}
            href={item.path}
            className="breadcrumb-link"
          >
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}