// src/components/sectionNav/variants/myNav.tsx
'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll'; // Add this import
import SectionNav from '../base/baseSideNav';
import { 
    navigationLinks,
    homeNavigationLinks,
    saleNavigationLinks,
    type NavGroup
} from '../base/baseSideNav';

export default function MyNav() {
    const pathname = usePathname();

    const getNavigationLinks = (): NavGroup[] => {
        if (pathname === '/') return homeNavigationLinks;
        if (pathname.startsWith('/sale')) return saleNavigationLinks;
        return navigationLinks;
    };

    return (
        <SectionNav title="Navigation">
            <div className="flex flex-col gap-4">
                {getNavigationLinks().map((group, index) => {
                    const filteredGroupLinks = group.links.filter(link => !link.disabled);
                    if (filteredGroupLinks.length === 0) return null;

                    return (
                        <div key={index} className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium text-zinc-400 px-2">
                                {group.title}
                            </h3>
                            {filteredGroupLinks.map((link) => (
                                link.href.startsWith('#') ? (
                                    <ScrollLink
                                        key={link.href}
                                        to={link.href.substring(1)}
                                        spy={true}
                                        smooth={true}
                                        offset={-80}
                                        duration={500}
                                        className={`p-2 rounded-md transition-colors cursor-pointer ${
                                            pathname === link.href
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-zinc-700/50'
                                        }`}
                                    >
                                        {link.label}
                                    </ScrollLink>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`p-2 rounded-md transition-colors ${
                                            pathname === link.href
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-zinc-700/50'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            ))}
                            {index < getNavigationLinks().length - 1 && (
                                <div className="h-px bg-zinc-400/30 my-2" />
                            )}
                        </div>
                    );
                })}
            </div>
        </SectionNav>
    );
}