// src/app/account/myBlogs/blogWorkspace/[blogId]/BlogContentEditor.tsx

/**
 * BlogContentEditor.tsx
 * 
 * Ansvar:
 * Håndterer INDHOLD-sektionen af en blog: titel, undertitel og content (HTML).
 * Skifter mellem view mode (læsning) og edit mode (redigering).
 * 
 * Funktioner:
 * - View mode: Viser titel, undertitel og content som formateret HTML
 * - Edit mode: Viser input-felter for titel/undertitel + Lexical editor til content
 * - Tegnantal-visning for titel og undertitel (max 160 tegn)
 * - Validering: Titel er påkrævet
 * 
 * Komponenter:
 * - BlogLexicalEditor: Rich text editor til blog content
 * 
 * Bruges af: blogWorkspace.tsx (i Editor tab)
 */

'use client';

import { Input } from "@heroui/react";
import { Blog_DTO } from "@/api/types/AngoraDTOs";
import BlogLexicalEditor from "./LexicalEditor";
import { useRef, useEffect } from "react";
import { useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';

interface Props {
  editedData: Blog_DTO;
  isEditing: boolean;
}

export default function BlogContentEditor({ editedData, isEditing }: Props) {
  const { updateField } = useBlogWorkspace();
  const inputClassName = "transition-colors duration-200";
  const contentRef = useRef<HTMLDivElement>(null);

  // Tilføj billede-metadata til højre for hvert billede i view mode
  useEffect(() => {
    if (isEditing || !contentRef.current || !editedData.photos?.length) return;

    const imgs = Array.from(contentRef.current.querySelectorAll('img'));
    imgs.forEach(img => {
      // Skip hvis allerede wrapped
      if (img.parentElement?.classList.contains('photo-wrapper')) return;

      const photo = editedData.photos?.find(p => 
        img.src.includes(p.cloudinaryPublicId) || img.src.includes(p.filePath)
      );

      if (!photo) return;

      // Opret wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'photo-wrapper blog-image-wrapper';
      wrapper.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
      `;

      // Flyt img ind i wrapper
      const originalParent = img.parentElement!;
      originalParent.replaceChild(wrapper, img);
      wrapper.appendChild(img);

      // Opdater img styling
      img.style.cssText = `
        max-width: 60%;
        height: auto;
        border-radius: 0.5rem;
        margin: 0;
      `;

      // Opret metadata div
      const meta = document.createElement('div');
      meta.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: hsl(var(--heroui-foreground) / 0.6);
        min-width: 180px;
      `;

      const fileNameEl = document.createElement('div');
      fileNameEl.textContent = `📁 ${photo.fileName}`;
      
      const date = new Date(photo.uploadDate);
      const uploadEl = document.createElement('div');
      uploadEl.textContent = `📅 ${date.toLocaleDateString('da-DK', {
        year: 'numeric', month: 'long', day: 'numeric'
      })}`;

      meta.appendChild(fileNameEl);
      meta.appendChild(uploadEl);
      wrapper.appendChild(meta);
    });
  }, [isEditing, editedData.content, editedData.photos]);
  
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Vis titel og undertitel som text */}
        <div className="space-y-4 pb-6 border-b border-divider">
          <h1 className="text-4xl font-bold text-heading">
            {editedData.title || "Ingen titel"}
          </h1>
          {editedData.subtitle && (
            <p className="text-xl text-muted">
              {editedData.subtitle}
            </p>
          )}
        </div>
        
        {/* Vis content med billede-metadata */}
        <div
          ref={contentRef}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: editedData.content || "Intet indhold" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editor mode: Titel og undertitel som input felter */}
      <div className="space-y-4 p-6 bg-content1 rounded-lg border border-divider">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <h3 className="text-lg font-semibold text-heading">Blog Header</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-body mb-2">
              Titel <span className="text-danger">*</span>
            </label>
            <Input
              value={editedData.title || ""}
              onChange={(e) => updateField('title', e.target.value)}
              className={inputClassName}
              placeholder="Indtast en fængende titel..."
              maxLength={160}
              isRequired
              size="lg"
              classNames={{
                input: "text-xl font-semibold"
              }}
            />
            <p className="text-xs text-muted mt-1">
              {editedData.title?.length || 0}/160 tegn
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-body mb-2">
              Undertitel
            </label>
            <Input
              value={editedData.subtitle || ""}
              onChange={(e) => updateField('subtitle', e.target.value)}
              className={inputClassName}
              placeholder="Tilføj en kort beskrivelse..."
              maxLength={160}
              classNames={{
                input: "text-base"
              }}
            />
            <p className="text-xs text-muted mt-1">
              {editedData.subtitle?.length || 0}/160 tegn
            </p>
          </div>
        </div>
      </div>

      {/* Content editor */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <h3 className="text-lg font-semibold text-heading">Blog Indhold</h3>
        </div>
        
        <BlogLexicalEditor
          value={editedData.content || ""}
          onChange={(html) => updateField('content', html)}
          blogId={editedData.id}
          existingPhotos={editedData.photos || []}
        />
      </div>
    </div>
  );
}