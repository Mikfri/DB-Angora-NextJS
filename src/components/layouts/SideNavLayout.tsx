// src/components/layouts/SideNavLayout.tsx
import React from 'react';

interface SideNavLayoutProps {
  sideNav: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Layout component som danner 2 kolonner: en til 'sideNav' og en til 'maincontent'.
 * @param {React.ReactNode} sideNav - The side navigation component to display.
 * @param {React.ReactNode} children - The main content to display.
 * @returns {JSX.Element}
 */
export default function SideNavLayout({ sideNav, children }: SideNavLayoutProps) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Sidenav med forbedret scrolling og respekt for afrundede hjørner */}
        <aside className="lg:col-span-1">
          <div className="bg-zinc-800/90 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 overflow-hidden">
            {/* Indre container med padding og scrolling */}
            <div className="side-nav sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pt-0.5 pr-1.5 pb-2">
              <div className="pr-2 pl-0.5 py-1.5">
                {sideNav}
              </div>
            </div>
          </div>
        </aside>
        
        {/* Hovedindhold */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    );
  }