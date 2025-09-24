// src/app/account/myBlogs/blogWorkspace/[blogId]/blogWorkspace.tsx
'use client';

import { Blog_DTO } from '@/api/types/AngoraDTOs';
import { Tabs, Tab, Button } from "@heroui/react";
import { useState } from 'react';
import { useBlogWorkspace } from '@/hooks/blogs/useBlogWorkspace';
import { editableFieldLabels, renderBlogField } from './blogFormFields';
import { Blog_UpdateDTO } from '@/api/types/AngoraDTOs';
import { FaEdit } from 'react-icons/fa';
import BlogImageSection from './blogImages'; // <-- TILFØJ DENNE IMPORT

// Import ikoner
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

export default function BlogWorkspace({ blog: initialBlog }: { blog: Blog_DTO }) {
    const [activeTab, setActiveTab] = useState("editor");
    //const { setSecondaryNav } = useNav();

    // Brug blog workspace hook
    const {
    currentBlog,
    isEditing,
    isSaving,
    editedData,
    setEditedData,
    setIsEditing,
    handleSave,
    handleCancelEdit
} = useBlogWorkspace(initialBlog);
    
    const displayTitle = currentBlog.title || 'Nyt blogindlæg';
    const publishStatus = currentBlog.isPublished ? 'Publiceret' : 'Kladde';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100">
                        {displayTitle}
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
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
                    {/* DIREKTE BLOG EDITOR - ingen mellemlag */}
                    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 overflow-hidden">
                        {/* Header med edit/save knapper */}
                        <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
                            <h3 className="text-zinc-100 font-medium">Blog Editor</h3>
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

                        {/* Content - brug blogFormFields direkte */}
                        <form onSubmit={handleSubmit} className="grid gap-6 p-6">
                            {(Object.keys(editableFieldLabels) as Array<keyof Blog_UpdateDTO>)
                                .filter(key => key !== 'authorId') // Skip non-editable field
                                .map((key) => (
                                    <div key={key} className="space-y-2">
                                        <label
                                            htmlFor={`${key}-input`}
                                            className="block text-sm font-medium text-zinc-300"
                                        >
                                            {editableFieldLabels[key]}
                                        </label>
                                        {renderBlogField(
                                            key,
                                            currentBlog[key],
                                            isEditing,
                                            editedData,
                                            setEditedData
                                        )}
                                    </div>
                                ))}
                        </form>
                    </div>
                </Tab>

                <Tab key="images" title={<div className="flex items-center space-x-2"><RiImageLine className="text-xl" /><span>Billeder</span></div>}>
                    <BlogImageSection
                        blogId={currentBlog.id}
                        currentPhotos={currentBlog.photos || []}
                        featuredImageId={undefined} // <-- ÆNDRET FRA featuredImageUrl til undefined
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