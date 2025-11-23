// src/app/account/myBlogs/blogWorkspace/[blogId]/blogWorkspace.tsx

/**
 * blogWorkspace.tsx
 * 
 * Ansvar:
 * Hoved-layout for blog workspace med tab-navigation (Editor, Billeder, Forhåndsvisning, Publicering).
 * Koordinerer brugerens interaktion med blog editing og gemmer data via BlogWorkspaceContext.
 * 
 * Funktioner:
 * - Tab-navigation mellem forskellige blog workspace sektioner
 * - Rediger/Gem/Annuller funktionalitet
 * - Viser blog titel og publicerings-status
 * - Organiserer indhold i to sektioner: "Indhold" (titel/undertitel/content) og "Metadata"
 * 
 * Komponenter:
 * - BlogContentEditor: Håndterer titel, undertitel og content
 * - renderBlogField(): Håndterer metadata-felter (synlighed, kategori, tags, etc.)
 * - BlogImageSection: Håndterer billeder
 * 
 * Bruges af: page.tsx
 */

'use client';

import { Blog_DTO } from '@/api/types/AngoraDTOs';
import { Tabs, Tab, Button } from "@heroui/react";
import { useState } from 'react';
import { editableFieldLabels, renderBlogField } from './blogFormFields';
import BlogContentEditor from './BlogContentEditor';
import { FaEdit } from 'react-icons/fa';
import BlogImageSection from './blogImages';
import { useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';

import { RiEditLine, RiEyeLine, RiImageLine, RiSendPlaneLine } from "react-icons/ri";

const BlogPreview = ({ blog }: { blog: Blog_DTO }) => (
    <div className="p-4 bg-zinc-700/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Blog Forhåndsvisning</h3>
        <p className="text-zinc-300">Preview kommer her... Blog ID: {blog.id}</p>
    </div>
);

const BlogPublishing = ({ blog }: { blog: Blog_DTO }) => (
    <div className="p-4 bg-zinc-700/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Blog Publicering</h3>
        <p className="text-zinc-300">Publicering kommer her... Blog ID: {blog.id}</p>
    </div>
);

export default function BlogWorkspace() {
    const [activeTab, setActiveTab] = useState("editor");

    const {
        blog: currentBlog,
        isEditing,
        isSaving,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit
    } = useBlogWorkspace();

    if (!currentBlog) {
        return <div>Loading...</div>;
    }

    // Vis editeret titel hvis man er i edit-mode
    const displayTitle = (isEditing && editedData?.title) 
        ? editedData.title 
        : currentBlog.title || 'Nyt blogindlæg';
    
    const publishStatus = currentBlog.isPublished ? 'Publiceret' : 'Kladde';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <div className="main-content-container">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-heading">
                        {displayTitle}
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        {publishStatus}
                    </p>
                </div>
            </div>

            <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                aria-label="Blog workspace"
                variant="underlined"
                color="primary"
                classNames={{
                    tabList: "gap-6 w-full relative p-0 border-b border-zinc-700/50",
                    cursor: "w-full bg-blue-500",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-blue-500",
                    panel: "pt-5"
                }}
            >
                <Tab
                    key="editor"
                    title={
                        <div className="flex items-center space-x-2">
                            <RiEditLine className="text-xl" />
                            <span>Editor</span>
                        </div>
                    }
                >
                    {/* FJERN outer styling - kun simpel wrapper */}
                    <div className="overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-divider">
                            <h3 className="text-heading">Blog Editor</h3>
                            <div className="flex items-center gap-2">
                                {!isEditing ? (
                                    <Button
                                        size="sm"
                                        color="warning"
                                        variant="light"
                                        onPress={() => setIsEditing(true)}
                                        startContent={<FaEdit size={16} />}
                                    >
                                        Rediger
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            color="success"
                                            onPress={handleSave}
                                            isDisabled={isSaving}
                                            className="text-white"
                                        >
                                            {isSaving ? 'Gemmer...' : 'Gem'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="secondary"
                                            variant="ghost"
                                            onPress={handleCancelEdit}
                                            isDisabled={isSaving}
                                        >
                                            Annuller
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Indhold sektion (titel, undertitel, content) */}
                            <section>
                                <BlogContentEditor
                                    editedData={editedData ?? currentBlog}
                                    setEditedData={setEditedData}
                                    isEditing={isEditing}
                                />
                            </section>

                            {/* Metadata sektion (synlighed, kategori, tags, etc.) */}
                            <section className="space-y-6 pt-6 border-t border-divider">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-secondary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-heading">Metadata & Indstillinger</h3>
                                </div>
                                
                                {(Object.keys(editableFieldLabels) as Array<keyof typeof editableFieldLabels>)
                                    .filter(key => key !== 'authorId')
                                    .map((key) => (
                                        <div key={key} className="space-y-2">
                                            <label
                                                htmlFor={`${key}-input`}
                                                className="block text-sm font-medium text-body"
                                            >
                                                {editableFieldLabels[key]}
                                            </label>
                                            {renderBlogField(
                                                key,
                                                currentBlog[key],
                                                isEditing,
                                                editedData ?? currentBlog,
                                                setEditedData
                                            )}
                                        </div>
                                    ))}
                            </section>
                        </form>
                    </div>
                </Tab>

                <Tab key="images" title={<div className="flex items-center space-x-2"><RiImageLine className="text-xl" /><span>Billeder</span></div>}>
                    <BlogImageSection
                        blogId={currentBlog.id}
                        currentPhotos={currentBlog.photos || []}
                        featuredImageId={undefined}
                        onPhotosUpdated={() => {
                            window.location.reload();
                        }}
                    />
                </Tab>

                <Tab key="preview" title={<div className="flex items-center space-x-2"><RiEyeLine className="text-xl" /><span>Forhåndsvisning</span></div>}>
                    <BlogPreview blog={currentBlog} />
                </Tab>

                <Tab key="publishing" title={<div className="flex items-center space-x-2"><RiSendPlaneLine className="text-xl" /><span>Publicering</span></div>}>
                    <BlogPublishing blog={currentBlog} />
                </Tab>
            </Tabs>
        </div>
    );
}