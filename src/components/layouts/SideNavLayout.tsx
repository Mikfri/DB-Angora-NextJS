// src/components/layouts/SideNavLayout.tsx
import React from 'react';

interface SideNavLayoutProps {
  leftSideNav?: React.ReactNode;
  rightSideNav?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Layout component som danner 1-3 kolonner:
 * - Venstre sidenav (valgfri)
 * - Hovedindhold (midten)
 * - Højre sidenav (valgfri)
 * 
 * Grid layouts:
 * - Kun venstre nav:  1/4 (25%) | 3/4 (75%)
 * - Kun højre nav:    3/4 (75%) | 1/4 (25%)
 * - Begge navs:       2/8 (25%) | 4/8 (50%) | 2/8 (25%)
 * - Ingen navs:       Fuld bredde
 */
export default function SideNavLayout({ leftSideNav, rightSideNav, children }: SideNavLayoutProps) {
  const hasLeft = !!leftSideNav;
  const hasRight = !!rightSideNav;
  const hasBoth = hasLeft && hasRight;

  // Bestem grid kolonner baseret på hvilke navs der er aktive
  let gridCols: string;
  let mainColSpan: string;

  if (hasBoth) {
    // Begge navs: 2/8 | 4/8 | 2/8
    gridCols = 'grid-cols-1 lg:grid-cols-8';
    mainColSpan = 'lg:col-span-4';
  } else if (hasLeft) {
    // Kun venstre: 1/4 | 3/4
    gridCols = 'grid-cols-1 lg:grid-cols-4';
    mainColSpan = 'lg:col-span-3';
  } else if (hasRight) {
    // Kun højre: 3/4 | 1/4
    gridCols = 'grid-cols-1 lg:grid-cols-4';
    mainColSpan = 'lg:col-span-3';
  } else {
    // Ingen navs: fuld bredde
    gridCols = 'grid-cols-1';
    mainColSpan = '';
  }

  return (
    <div className={`grid ${gridCols} gap-6 mb-6`}>
      {/* Venstre sidenav (kun hvis defineret) */}
      {hasLeft && (
        <aside className={hasBoth ? 'lg:col-span-2' : 'lg:col-span-1'}>
          <div className="sticky top-20 h-fit">
            <div className="max-h-[calc(100vh-6rem)] overflow-y-auto">
              {leftSideNav}
            </div>
          </div>
        </aside>
      )}

      {/* Hovedindhold */}
      <main className={mainColSpan}>
        {children}
      </main>

      {/* Højre sidenav (kun hvis defineret) */}
      {hasRight && (
        <aside className={hasBoth ? 'lg:col-span-2' : 'lg:col-span-1'}>
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