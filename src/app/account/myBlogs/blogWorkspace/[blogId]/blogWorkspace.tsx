// src/app/account/myBlogs/blogWorkspace/[blogId]/blogWorkspace.tsx

/**
 * blogWorkspace.tsx
 * 
 * Ansvar:
 * Hoved-layout for blog workspace med tab-navigation (Editor, Billeder, Forhåndsvisning, Publicering).
 * Koordinerer brugerens interaktion med blog editing og gemmer data via BlogWorkspaceContext.
 */

'use client';

import { Divider, Button, Card, CardBody, CardHeader } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';
import BlogImageSection from './blogImages';
import BlogContentEditor from './BlogContentEditor';
import { AutoSaveIndicator } from '@/components/ui/AutoSaveIndicator';
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
            startContent={<FaArrowLeft />} 
            onPress={() => router.back()}
          >
            Tilbage
          </Button>
          <h1 className="text-2xl font-bold">Rediger blog</h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
          
          {!isEditing ? (
            <Button
              color="primary"
              startContent={<FaEdit />}
              onPress={() => setIsEditing(true)}
            >
              Rediger
            </Button>
          ) : (
            <>
              <Button
                variant="bordered"
                startContent={<FaTimes />}
                onPress={handleCancelEdit}
              >
                Annuller
              </Button>
              <Button
                color="primary"
                startContent={<FaSave />}
                onPress={handleSave}
                isLoading={isSaving}
                isDisabled={!hasUnsavedChanges}
              >
                Gem nu
              </Button>
            </>
          )}

          <Button
            variant="bordered"
            startContent={<FaEye />}
            onPress={() => window.open(`/blogs/${blog.slug}`, '_blank')}
          >
            Preview
          </Button>
        </div>
      </div>

      <Divider />

      {/* Content Editor - fuld bredde */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Indhold</h2>
        </CardHeader>
        <CardBody>
          <BlogContentEditor
            editedData={editedData}
            isEditing={isEditing}
          />
        </CardBody>
      </Card>

      {/* Billeder sektion */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Billeder</h2>
        </CardHeader>
        <CardBody>
          <BlogImageSection
            blogId={blog.id}
            currentPhotos={editedData.photos || []}
            featuredImageId={undefined}
            onPhotosUpdated={() => {}}
          />
        </CardBody>
      </Card>
    </div>
  );
}