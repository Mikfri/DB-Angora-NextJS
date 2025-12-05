// src/components/nav/side/BlogWorkspaceNavClient.tsx
'use client';

import { ReactNode, useState } from 'react';
import { Divider, Button, Input, Textarea, Select, SelectItem } from '@heroui/react';
import { 
  FaRegEdit, FaUserCircle, FaCalendarAlt, FaEye, FaEyeSlash, 
  FaTrash, FaEdit, FaTimes, FaSave, FaTags, FaListAlt, FaFileAlt 
} from "react-icons/fa";
import { useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';
import DeleteBlogModal from '@/components/modals/blog/deleteBlogModal';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';

const SECTIONS = {
  ACTIONS: 'Handlinger',
  INFO: 'Blog information',
  METADATA: 'Metadata',
  AUTHOR: 'Forfatter',
  STATUS: 'Status'
} as const;

const DEFAULT_TEXTS = {
  UNKNOWN: 'Ukendt',
  NOT_SET: 'Ikke angivet'
} as const;

const visibilityOptions = [
  { value: "Public", label: "Offentlig" },
  { value: "PaidContent", label: "Betalt indhold" }
];

export function BlogWorkspaceNavClient() {
  const {
    blog,
    editedData,
    isPublishing,
    isEditing,
    setIsEditing,
    updateField,
    handlePublish,
    handleUnpublish,
    handleDelete,
    handleSave,
    handleCancelEdit,
    hasUnsavedChanges,
    isSaving
  } = useBlogWorkspace();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMetadataEditing, setIsMetadataEditing] = useState(false);

  if (!blog || !editedData) return null;

  // Fallbacks
  const title = blog.title || DEFAULT_TEXTS.NOT_SET;
  const subtitle = blog.subtitle || DEFAULT_TEXTS.NOT_SET;
  const author = blog.authorName || DEFAULT_TEXTS.UNKNOWN;
  const created = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('da-DK') : DEFAULT_TEXTS.UNKNOWN;
  const published = blog.isPublished
    ? (blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('da-DK') : 'Planlagt')
    : 'Ikke publiceret';
  const visibility = visibilityOptions.find(v => v.value === editedData.visibilityLevel)?.label || editedData.visibilityLevel || 'Ikke angivet';
  const category = editedData.category || DEFAULT_TEXTS.NOT_SET;
  const tags = editedData.tags || DEFAULT_TEXTS.NOT_SET;
  const metaDescription = editedData.metaDescription || DEFAULT_TEXTS.NOT_SET;

  const handleDeleteClick = () => setIsDeleteModalOpen(true);
  const handleDeleteConfirm = async () => {
    await handleDelete();
  };

  return (
    <>
      <div className="w-full p-1 space-y-3">
        
        {/* Handlinger */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            {SECTIONS.ACTIONS}
          </h3>
          <div className="flex flex-col gap-2">
            <Button
              color="primary"
              variant="bordered"
              fullWidth
              size="sm"
              onPress={handlePublish}
              isDisabled={isPublishing || blog.isPublished}
            >
              Publicer
            </Button>
            <Button
              color="primary"
              variant="bordered"
              fullWidth
              size="sm"
              onPress={handleUnpublish}
              isDisabled={isPublishing || !blog.isPublished}
            >
              Træk tilbage
            </Button>
            <Button
              color="danger"
              variant="bordered"
              fullWidth
              size="sm"
              startContent={<FaTrash />}
              onPress={handleDeleteClick}
            >
              Slet blog
            </Button>
          </div>
        </div>

        <Divider />

        {/* Blog info */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            {SECTIONS.INFO}
          </h3>
          <div className="space-y-2">
            <InfoRow icon={<FaRegEdit />} label="Titel" value={title} />
            <InfoRow icon={<FaRegEdit />} label="Undertitel" value={subtitle} truncate />
          </div>
        </div>

        <Divider />

        {/* Metadata - redigerbar sektion */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
              {SECTIONS.METADATA}
            </h3>
            {!isMetadataEditing ? (
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={() => setIsMetadataEditing(true)}
              >
                <FaEdit className="w-3 h-3" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  onPress={() => setIsMetadataEditing(false)}
                >
                  <FaTimes className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {!isMetadataEditing ? (
            <div className="space-y-2">
              <InfoRow icon={<FaListAlt />} label="Kategori" value={category} />
              <InfoRow icon={<FaTags />} label="Tags" value={tags} truncate />
              <InfoRow icon={<FaFileAlt />} label="Meta" value={metaDescription} truncate />
              <InfoRow icon={<FaEye />} label="Synlighed" value={visibility} />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Kategori */}
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Kategori</label>
                <EnumAutocomplete
                  enumType="BlogCategories"
                  value={typeof editedData.category === 'string' ? editedData.category : null}
                  onChange={val => updateField('category', val ?? "")}
                  label="Kategori"  // <-- Tilføj denne
                  placeholder="Vælg kategori"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Tags</label>
                <Input
                  size="sm"
                  value={editedData.tags || ""}
                  onChange={(e) => updateField('tags', e.target.value)}
                  placeholder="Komma-separerede tags..."
                />
              </div>

              {/* Meta beskrivelse */}
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Meta beskrivelse</label>
                <Textarea
                  size="sm"
                  value={editedData.metaDescription || ""}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  placeholder="SEO beskrivelse..."
                  minRows={2}
                  maxRows={3}
                />
              </div>

              {/* Synlighed */}
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Synlighed</label>
                <Select
                  size="sm"
                  selectedKeys={editedData.visibilityLevel ? [editedData.visibilityLevel] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    updateField('visibilityLevel', selectedKey);
                  }}
                  placeholder="Vælg synlighed"
                >
                  {visibilityOptions.map((option) => (
                    <SelectItem key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* Forfatter */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            {SECTIONS.AUTHOR}
          </h3>
          <div className="space-y-2">
            <InfoRow icon={<FaUserCircle />} label="Forfatter" value={author} />
            <InfoRow icon={<FaCalendarAlt />} label="Oprettet" value={created} />
          </div>
        </div>

        <Divider />

        {/* Status */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            {SECTIONS.STATUS}
          </h3>
          <div className="space-y-2">
            <InfoRow
              icon={blog.isPublished ? <FaEye className="text-success" /> : <FaEyeSlash />}
              label="Publiceret"
              value={published}
            />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteBlogModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        blogTitle={title}
        isDeleting={false}
      />
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
  truncate = false
}: {
  icon: ReactNode;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-foreground/40 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-foreground/50 block">{label}</span>
        <span className={`text-sm text-foreground ${truncate ? 'truncate block' : ''}`}>
          {value}
        </span>
      </div>
    </div>
  );
}