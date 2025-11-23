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

// Import alle sidenav-komponenter
import MyNav from "@/components/nav/side/index/MyNav";
import RabbitOwnNav from "@/components/nav/side/index/RabbitOwnNav";
import BlogOwnNav from "@/components/nav/side/index/BlogOwnNav";
import BlogWorkspaceNav from "@/components/nav/side/index/BlogWorkspaceNav";
import RabbitSaleNav from "@/components/nav/side/index/RabbitSaleNav";
import BlogNav from "@/components/nav/side/index/BlogNav";
import RabbitProfileNav from "@/components/nav/side/index/RabbitProfileNav";
import RabbitBreedingNav from "@/components/nav/side/index/RabbitBreedingNav";
import UserProfileNav from "@/components/nav/side/index/UserProfileNav";

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

  // Tjek om vi er på blogWorkspace
  const isBlogWorkspace = pathname.startsWith(ROUTES.ACCOUNT.BLOG_WORKSPACE_BASE);

  // Tjek om vi er på rabbitProfile
  const isRabbitProfile = pathname.startsWith('/account/myRabbits/rabbitProfile/');

  // Bestem venstre sidenav baseret på pathname
  const leftSideNav = useMemo(() => {
    // Forside
    if (pathname === ROUTES.HOME) return <MyNav />;

    // Mine kaniner oversigt
    if (pathname === ROUTES.ACCOUNT.MY_RABBITS) return <RabbitOwnNav />;

    // Transfer requests (under mine kaniner)
    if (pathname === ROUTES.ACCOUNT.TRANSFER_REQUESTS) return <RabbitOwnNav />;

    // Kanin profil (egen kanin)
    if (pathname.startsWith(ROUTES.ACCOUNT.RABBIT_PROFILE(''))) {
      return <RabbitProfileNav />;
    }

    // Brugerprofil (user profile)
    if (pathname.startsWith(ROUTES.ACCOUNT.USER_PROFILE(''))) {
      return <UserProfileNav />;
    }

    // Mine blogs (liste-visning)
    if (pathname === ROUTES.ACCOUNT.MY_BLOGS) return <BlogOwnNav />;

    // Blog workspace
    if (isBlogWorkspace) {
      return <BlogWorkspaceNav />;
    }

    // Blogs oversigt
    if (pathname === ROUTES.BLOGS.BASE) return <BlogNav />;

    // Blog post (fx /blogs/[slug])
    if (pathname.startsWith(ROUTES.BLOGS.BASE + "/")) return <BlogNav />;

    // Annoncer oversigt
    if (pathname === ROUTES.SALE.BASE) return <MyNav />;

    // Kaniner til salg (liste + profil)
    if (pathname === ROUTES.SALE.RABBITS) return <RabbitSaleNav />;

    // Kaniner til avl (nyt)
    if (pathname === ROUTES.ACCOUNT.RABBITS_FOR_BREEDING) return <RabbitBreedingNav />;


    // Account-sider uden sidenav
    const noSideNavPaths = [
      ROUTES.ACCOUNT.PROFILE,
    ];
    if (noSideNavPaths.some(path => pathname === path || pathname.startsWith(path))) {
      return null;
    }

    // Default account sidenav
    if (pathname.startsWith('/account')) {
      return <MyNav />;
    }

    return null;
  }, [pathname, isBlogWorkspace]);

  // Bestem højre sidenav baseret på pathname (profil-specifik)
  // NOTE: Højre sidenav håndteres nu direkte i page-komponenter hvor nødvendigt
  // Se rabbitSaleProfileClient.tsx for implementation
  const rightSideNav = null;

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hovedindhold - FJERN nested wrapper for at sticky virker */}
      <main className="flex-grow w-full px-4">
        <div className="mx-auto max-w-screen-2xl">
          {/* TopNav wrapper - KUN positioning */}
          <div className="sticky top-0 z-50">
            <TopNav />
          </div>

          {shouldShowHeader && (
            <PageHeader />
          )}

          {/* Content med providers */}
          {isBlogWorkspace ? (
            <BlogWorkspaceProvider>
              <AuthGuard>
                {leftSideNav ? (
                  <SideNavLayout
                    leftSideNav={
                      <Suspense fallback={<SideNavLoading />}>
                        {leftSideNav}
                      </Suspense>
                    }
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
                )}
              </AuthGuard>
            </BlogWorkspaceProvider>
          ) : isRabbitProfile ? (
            <RabbitProfileProvider>
              <AuthGuard>
                {leftSideNav ? (
                  <SideNavLayout
                    leftSideNav={
                      <Suspense fallback={<SideNavLoading />}>
                        {leftSideNav}
                      </Suspense>
                    }
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
                )}
              </AuthGuard>
            </RabbitProfileProvider>
          ) : (
            <AuthGuard>
              {leftSideNav ? (
                <SideNavLayout
                  leftSideNav={
                    <Suspense fallback={<SideNavLoading />}>
                      {leftSideNav}
                    </Suspense>
                  }
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
              )}
            </AuthGuard>
          )}
          {/* Footer (altid synlig) */}
          <Footer />
        </div>
      </main>
    </div>
  );
}