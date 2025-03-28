// src/components/layout/SideNavLayout.tsx
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
        {/* Sidenav */}
        <aside className="lg:col-span-1">
          <div className="side-nav">
            {sideNav}
          </div>
        </aside>
        
        {/* Hovedindhold */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    );
  }