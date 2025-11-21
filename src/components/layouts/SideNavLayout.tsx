// src/components/layouts/SideNavLayout.tsx
import React from 'react';

interface SideNavLayoutProps {
  leftSideNav: React.ReactNode;
  rightSideNav?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Layout component som danner 2-3 kolonner:
 * - Venstre sidenav (altid synlig når leftSideNav er angivet)
 * - Hovedindhold (midten)
 * - Højre sidenav (valgfri, kun hvis rightSideNav er angivet)
 * 
 * Grid layout:
 * - Med højre nav: 2/8 (25%) | 4/8 (50%) | 2/8 (25%)
 * - Uden højre nav: 1/4 (25%) | 3/4 (75%)
 */
export default function SideNavLayout({ leftSideNav, rightSideNav, children }: SideNavLayoutProps) {
  const gridCols = rightSideNav
    ? 'grid-cols-1 lg:grid-cols-8' // 3 kolonner på desktop
    : 'grid-cols-1 lg:grid-cols-4'; // 2 kolonner på desktop

  const mainColSpan = rightSideNav
    ? 'lg:col-span-4' // 4/8 (50%) når højre nav er aktiv
    : 'lg:col-span-3'; // 3/4 (75%) når kun venstre nav

  const leftSideNavColSpan = rightSideNav
    ? 'lg:col-span-2' // 2/8 (25%) når højre nav er aktiv
    : 'lg:col-span-1'; // 1/4 (25%) når kun venstre nav

  return (
    // Fjern items-start her - det kan forstyrre sticky
    <div className={`grid ${gridCols} gap-6 mb-6`}>
      {/* Venstre sidenav */}
      <aside className={leftSideNavColSpan}>
        <div className="sticky top-20 h-fit">
          <div className="max-h-[calc(100vh-6rem)] overflow-y-auto">
            {leftSideNav}
          </div>
        </div>
      </aside>

      {/* Hovedindhold */}
      <main className={mainColSpan}>
        {children}
      </main>

      {/* Højre sidenav (valgfri) */}
      {rightSideNav && (
        <aside className="lg:col-span-2">
          <div className="sticky top-20 h-fit">
            <div className="max-h-[calc(100vh-6rem)] overflow-y-auto">
              {rightSideNav}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}