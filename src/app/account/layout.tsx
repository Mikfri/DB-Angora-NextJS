'use client'
import { usePathname } from 'next/navigation';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import MyNav from '@/components/nav/side/index/MyNav';
import { useNav } from '@/components/providers/Providers';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { primaryNav } = useNav();
  
  // Stier der skal have custom layout (ingen standard sidenav)
  const noSideNavPaths = [
    '/account/profile',
    '/account/myRabbits',
    '/account/myRabbits/rabbitProfile',
    // Fjern '/account/rabbitsForbreeding' herfra, så den kan bruge primaryNav
  ];
  
  // Håndtér underpaths og sidenav baseret på path patterns
  const pathMatches = (path: string) => {
    return noSideNavPaths.some(navPath => {
      // Eksakt matches
      if (path === navPath) return true;
      
      // Specialtilfælde for kaninprofil - udelad alle kaninprofil-stier komplet
      if (navPath === '/account/myRabbits/rabbitProfile' && path.startsWith(navPath)) {
        return true; 
      }
      
      // For andre undermapper, følg parent path regel
      if (path.startsWith(navPath + '/') && !path.startsWith('/account/myRabbits/rabbitProfile')) {
        return true;
      }
      
      return false;
    });
  };
  
  // Brug den forbedrede matching logik
  const shouldHaveSideNav = !pathMatches(pathname);
  
  if (!shouldHaveSideNav) {
    // Returner indholdet uden en sidenav
    return children;
  }
  
  // Hvis der er sat en primaryNav via useNav, brug den
  // ellers brug MyNav som standard
  const sideNavContent = primaryNav || <MyNav />;
  
  // For alle andre sider, brug sidenav
  return (
    <SideNavLayout sideNav={sideNavContent}>
      {children}
    </SideNavLayout>
  );
}