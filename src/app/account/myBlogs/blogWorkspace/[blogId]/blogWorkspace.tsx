// src/app/account/myBlogs/blogWorkspace/[blogId]/blogWorkspace.tsx

/**
 * blogWorkspace.tsx
 * 
 * Ansvar:
 * Hoved-layout for blog workspace med tab-navigation (Editor, Billeder, Forhåndsvisning, Publicering).
 * Koordinerer brugerens interaktion med blog editing og gemmer data via BlogWorkspaceContext.
 */

'use client';

import { Separator, Button, Card } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';
import BlogImageSection from './blogImages';
import BlogContentEditor from './BlogContentEditor';
import { AutoSaveIndicator } from '@/components/ui/custom/spinners/AutoSaveIndicator';
import { FaSave, FaEye, FaArrowLeft, FaEdit, FaTimes } from 'react-icons/fa';

export default function BlogWorkspace() {
  const router = useRouter();
  const { 
    blog, 
    isLoading, 
    error, 
    editedData,
    isEditing,
    setIsEditing,
    autoSaveStatus,
    lastSaved,
    hasUnsavedChanges,
    handleSave,
    handleCancelEdit,
    isSaving
  } = useBlogWorkspace();

  if (isLoading) {
    return <div className="p-8 text-center">Indlæser...</div>;
  }

  if (error || !blog || !editedData) {
    return <div className="p-8 text-center text-danger">{error?.message || 'Blog ikke fundet'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header med auto-save indikator */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onPress={() => router.back()}
          >
            <FaArrowLeft /> Tilbage
          </Button>
          <h1 className="text-2xl font-bold">Rediger blog</h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
          
          {!isEditing ? (
            <Button
              variant="primary"
              onPress={() => setIsEditing(true)}
            >
              <FaEdit /> Rediger
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onPress={handleCancelEdit}
              >
                <FaTimes /> Annuller
              </Button>
              <Button
                variant="primary"
                onPress={handleSave}
                isPending={isSaving}
                isDisabled={!hasUnsavedChanges}
              >
                <FaSave /> Gem nu
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onPress={() => window.open(`/blogs/${blog.slug}`, '_blank')}
          >
            <FaEye /> Preview
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content Editor - fuld bredde */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Indhold</h2>
        </Card.Header>
        <Card.Content>
          <BlogContentEditor
            editedData={editedData}
            isEditing={isEditing}
          />
        </Card.Content>
      </Card>

      {/* Billeder sektion */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Billeder</h2>
        </Card.Header>
        <Card.Content>
          <BlogImageSection
            blogId={blog.id}
            currentPhotos={editedData.photos || []}
            featuredImageId={undefined}
            onPhotosUpdated={() => {}}
          />
        </Card.Content>
      </Card>
    </div>
  );
}
