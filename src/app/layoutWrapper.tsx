// src/app/layoutWrapper.tsx

/**
 * LayoutWrapper - Client-side layout orchestrator
 * 
 * Ansvar:
 * 1. Renderer app-wide UI chrome (TopNav, Footer, PageHeader) som ALTID er synlig
 * 2. Bestemmer BÅDE venstre og højre SideNav baseret på current route
 * 3. Wrapper page content med AuthGuard for at beskytte beskyttede routes
 * 
 * SideNav logik (centraliseret):
 * - Venstre nav: Primær navigation baseret på section (account, sale, blogs)
 * - Højre nav: Profil-specifik navigation (kun på profil-sider)
 * - Begge bestemt af pathname (ingen context override)
 * 
 * Arkitektur fordele:
 * ✅ Simpel, forudsigelig logik (én kilde til sandhed)
 * ✅ Lettere at vedligeholde (alt ét sted)
 * ✅ Ingen context boilerplate (setPrimaryNav, etc.)
 * ✅ URL er source of truth (refresh bevarer samme layout)
 */

'use client'
import TopNav from "@/components/nav/top/TopNav";
import Footer from "@/components/footer/footer";
import PageHeader from "@/components/nav/headerBreadcrumb/Breadcrumbs";
import SideNavLayout from "@/components/layouts/SideNavLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { usePathname } from "next/navigation";
import { useMemo, Suspense } from "react";
import { ROUTES } from "@/constants/navigationConstants";
import { BlogWorkspaceProvider } from "@/contexts/BlogWorkspaceContext";
import { RabbitProfileProvider } from "@/contexts/RabbitProfileContext";
import { SaleProfileProvider } from "@/contexts/SaleProfileContext";

// Import alle sidenav-komponenter
import MyNav from "@/components/nav/side/MyNav";
import BlogNav from "@/components/nav/side/BlogNav";
import BlogOwnNav from "@/components/nav/side/BlogOwnNav";
import BlogWorkspaceNav from "@/components/nav/side/BlogWorkspaceNav";
import RabbitForbreedingNav from "@/components/nav/side/RabbitForbreedingNav";
import RabbitOwnNav from "@/components/nav/side/RabbitOwnNav";
import RabbitProfileNav from "@/components/nav/side/RabbitProfileNav";
import RabbitSaleNav from "@/components/nav/side/RabbitSaleNav";
import SaleProfileNav from "@/components/nav/side/SaleProfileNav";
import UserProfileNav from "@/components/nav/side/UserProfileNav";

// Sidenav loading skeleton
function SideNavLoading() {
  return (
    <div className="w-full h-full bg-zinc-800/50 animate-pulse rounded-xl">
      <div className="p-4">
        <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-6 bg-zinc-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Stier hvor header ikke skal vises
  const hideHeaderPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ];
  const shouldShowHeader = !hideHeaderPaths.some(path => pathname.startsWith(path));

  // Brug ROUTES konstanter i stedet for hardcoded paths
  const isBlogWorkspace = pathname.startsWith(ROUTES.ACCOUNT.BLOG_WORKSPACE_BASE);
  const isRabbitProfile = pathname.startsWith(ROUTES.ACCOUNT.RABBIT_PROFILE(''));
  const isSaleProfile = pathname.startsWith(ROUTES.SALE.RABBIT('')) && pathname !== ROUTES.SALE.RABBITS;

  // Bestem venstre sidenav baseret på pathname
  const leftSideNav = useMemo(() => {
    if (pathname === ROUTES.HOME) return <MyNav />;
    if (pathname === ROUTES.ACCOUNT.MY_RABBITS) return <RabbitOwnNav />;
    if (pathname === ROUTES.ACCOUNT.TRANSFER_REQUESTS) return <RabbitOwnNav />;
    if (pathname.startsWith(ROUTES.ACCOUNT.RABBIT_PROFILE(''))) return <RabbitProfileNav />;
    if (pathname.startsWith(ROUTES.ACCOUNT.USER_PROFILE(''))) return <UserProfileNav />;
    if (pathname === ROUTES.ACCOUNT.MY_BLOGS) return <BlogOwnNav />;
    if (isBlogWorkspace) return <BlogWorkspaceNav />;
    if (pathname === ROUTES.BLOGS.BASE) return <BlogNav />;
    if (pathname.startsWith(ROUTES.BLOGS.BASE + "/")) return <BlogNav />;
    if (pathname === ROUTES.SALE.BASE) return <MyNav />;
    if (pathname === ROUTES.SALE.RABBITS) return <RabbitSaleNav />;
    if (isSaleProfile) return null;
    if (pathname === ROUTES.ACCOUNT.RABBITS_FOR_BREEDING) return <RabbitForbreedingNav />;

    const noSideNavPaths = [ROUTES.ACCOUNT.PROFILE];
    if (noSideNavPaths.some(path => pathname === path || pathname.startsWith(path))) {
      return null;
    }

    if (pathname.startsWith('/account')) return <MyNav />;
    return null;
  }, [pathname, isBlogWorkspace, isSaleProfile]);

  // Bestem højre sidenav baseret på pathname
  const rightSideNav = useMemo(() => {
    // SaleProfileNav henter data fra context (ingen props nødvendige)
    if (isSaleProfile) {
      return <SaleProfileNav />;
    }
    
    return null;
  }, [isSaleProfile]);

  // Helper til at wrappe content med korrekt provider
  const renderContent = () => {
    const content = leftSideNav || rightSideNav ? (
      <SideNavLayout
        leftSideNav={leftSideNav ? (
          <Suspense fallback={<SideNavLoading />}>
            {leftSideNav}
          </Suspense>
        ) : undefined}
        rightSideNav={rightSideNav ? (
          <Suspense fallback={<SideNavLoading />}>
            {rightSideNav}
          </Suspense>
        ) : undefined}
      >
        {children}
      </SideNavLayout>
    ) : (
      <div>{children}</div>
    );

    // Wrap med korrekt provider baseret på route
    if (isBlogWorkspace) {
      return (
        <BlogWorkspaceProvider>
          <AuthGuard>{content}</AuthGuard>
        </BlogWorkspaceProvider>
      );
    }

    if (isRabbitProfile) {
      return (
        <RabbitProfileProvider>
          <AuthGuard>{content}</AuthGuard>
        </RabbitProfileProvider>
      );
    }

    if (isSaleProfile) {
      return (
        <SaleProfileProvider>
          <AuthGuard>{content}</AuthGuard>
        </SaleProfileProvider>
      );
    }

    return <AuthGuard>{content}</AuthGuard>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full px-4">
        <div className="mx-auto max-w-screen-2xl">
          {/* TopNav wrapper - KUN positioning */}
          <div className="sticky top-0 z-50">
            <TopNav />
          </div>

          {shouldShowHeader && <PageHeader />}

          {renderContent()}

          {/* Footer (altid synlig) */}
          <Footer />
        </div>
      </main>
    </div>
  );
}