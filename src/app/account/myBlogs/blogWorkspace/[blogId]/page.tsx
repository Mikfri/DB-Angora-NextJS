// src/app/account/myBlogs/blogWorkspace/[blogId]/page.tsx
'use client';

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

import { notFound, useParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import BlogWorkspace from "./blogWorkspace";
import { useBlogWorkspace } from "@/contexts/BlogWorkspaceContext";

export default function BlogWorkspacePage() {
  const params = useParams();
  const blogId = parseInt(params.blogId as string, 10);
  
  const { blog, isLoading, error } = useBlogWorkspace();
  
  // Valider blogId
  if (isNaN(blogId) || blogId <= 0) {
    return notFound();
  }
  
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
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
          <p className="text-amber-500">Du har ikke tilladelse til at redigere dette blogindlæg.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }
  
  // Viser blog workspace når den er indlæst
  if (blog) {
    return <BlogWorkspace blog={blog} />;
  }
  
  return null;
}