// src/components/nav/base/NavBase.tsx
import { SectionNavProps } from "@/types/navigation";
import { NavBaseClient } from "./NavBaseClient";

/**
 * Server komponent til navigation base UI struktur
 * 
 * @param props.title - Navigationssektionens titel
 * @param props.children - Indholdet der skal vises i navigationen
 * @param props.headerActions - Array af actions til headeren
 * @param props.footerActions - Array af actions til footeren
 */
export default function NavBase({
  title,
  children,
  headerActions = [],
  footerActions = []
}: SectionNavProps) {
  // Til server components, kan vi udnytte tidlig returværdi for edge cases
  if (!title && headerActions.length === 0 && footerActions.length === 0) {
    return <nav className="side-nav">{children}</nav>;
  }

  return (
    <nav className="side-nav">
      <div className="flex flex-col gap-4">
        {/* Forbedret conditional rendering med optional chaining */}
        {(title || headerActions?.length > 0) && (
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-zinc-700/50">
            {/* Nullish coalescing for title fallback */}
            {title && <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>}
            
            {/* Nullish coalescing og optional chaining */}
            {headerActions?.length > 0 && (
              <NavBaseClient actions={headerActions} variant="solid" />
            )}
          </div>
        )}

        {/* Content med forbedret typesikkerhed */}
        <div className="w-full">
          {children}
        </div>

        {/* Footer actions med optional chaining */}
        {footerActions?.length > 0 && (
          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-zinc-700/50">
            <NavBaseClient actions={footerActions} variant="light" />
          </div>
        )}
      </div>
    </nav>
  );
}