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
    <div className="w-full py-2">
      <Breadcrumbs
        classNames={{
          list: "gap-2",
          separator: "text-zinc-400 dark:text-zinc-600"
        }}
      >
        {breadcrumbItems.map((item) => (
          <BreadcrumbItem
            key={item.path}
            href={item.path}
            className="text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}