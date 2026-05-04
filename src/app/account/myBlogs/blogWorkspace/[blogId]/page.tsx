// src/app/account/myBlogs/blogWorkspace/[blogId]/page.tsx

/**
 * Ansvar:
 * Entry route for blog workspace siden for et givent blogId.
 *
 * Funktion:
 * - Håndterer loading/fejl/notFound states fra workspace-context
 * - Delegérer selve redigerings-UI'et til BlogWorkspace komponenten
 * - Kører bevidst som client component pga. editorens interaktive natur
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
        <Spinner size="lg" color="accent" />
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
