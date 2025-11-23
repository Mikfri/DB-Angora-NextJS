// src/app/account/myBlogs/blogWorkspace/[blogId]/page.tsx

/**
 * VIGTIG NOTE OM RENDERING:
 * ========================
 * Denne side bruger bevidst Client-Side Rendering (CSR) af følgende grunde:
 * 
 * 1. Siden er beskyttet bag login, så SEO er ikke relevant
 * 2. CSR løser TypeScript type problemer med Next.js page props
 * 3. Siden behøver ikke server-rendering for at fungere effektivt
 * 4. Blog editor kræver kompleks client-side interaktion
 * 
 * Derfor skal denne implementering IKKE ændres tilbage til SSR uden
 * at tage højde for TypeScript komplikationerne.
*/
'use client';

import { notFound } from "next/navigation";
import { Spinner } from "@heroui/react";
import BlogWorkspace from "./blogWorkspace";
import { useBlogWorkspace } from "@/contexts/BlogWorkspaceContext";

function BlogWorkspacePageInner() {
  const { blog, isLoading, error } = useBlogWorkspace();

  // Viser loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Viser fejlmeddelelser
  if (error) {
    if (error.status === 404) {
      return notFound();
    }

    if (error.status === 403) {
      return (
        <div className="main-content-container">
          <p className="text-amber-500">Du har ikke tilladelse til at redigere dette blogindlæg.</p>
        </div>
      );
    }

    return (
      <div className="main-content-container">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  if (blog) {
    return <BlogWorkspace />;
  }

  return null;
}

export default function BlogWorkspacePage() {
  return <BlogWorkspacePageInner />;
}