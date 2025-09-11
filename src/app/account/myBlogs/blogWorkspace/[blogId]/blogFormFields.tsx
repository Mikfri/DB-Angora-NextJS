// src/app/account/myBlogs/blogWorkspace/[blogId]/blogFormFields.tsx
import React, { ReactNode } from "react";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { Blog_DTO, Blog_UpdateDTO } from "@/api/types/AngoraDTOs";
import BlogLexicalEditor from "./LexicalEditor";

// Redigerbare felter for blog
export const editableFieldLabels: Record<keyof Blog_UpdateDTO, string> = {
    title: "Titel",
    subtitle: "Undertitel",
    content: "Indhold",
    visibilityLevel: "Synlighed",
    tags: "Tags",
    metaDescription: "Meta beskrivelse",
    authorId: "Forfatter ID" // Normalt ikke redigerbar
};

// Visibility options
const visibilityOptions = [
    { value: "Public", label: "Offentlig" },
    { value: "PaidContent", label: "Betalt indhold" }
];

export function renderBlogField(
    key: keyof Blog_UpdateDTO,
    value: unknown,
    isEditing: boolean,
    editedData: Blog_DTO,
    setEditedData: (data: Blog_DTO) => void,
    isChanged?: boolean
): ReactNode {
    const inputClassName = `transition-colors duration-200 ${isChanged ? 'border-amber-400' : ''}`;
    const textClassName = isChanged ? 'text-amber-400' : 'text-zinc-300';

    if (!isEditing) {
        return renderViewMode(key, value, textClassName);
    }

    return renderEditMode(key, editedData, setEditedData, inputClassName);
}

function renderViewMode(
    key: keyof Blog_UpdateDTO,
    value: unknown,
    textClassName: string
): ReactNode {
    if (key === "content") {
        return (
            <div 
                className={`${textClassName} prose prose-invert max-w-none`}
                dangerouslySetInnerHTML={{ __html: value as string || "Intet indhold" }}
            />
        );
    }

    if (key === "visibilityLevel") {
        const option = visibilityOptions.find(opt => opt.value === value);
        return <span className={textClassName}>{option?.label || value?.toString() || "Ikke angivet"}</span>;
    }

    if (key === "authorId") {
        return <span className="text-zinc-500 italic">Ikke redigerbar</span>;
    }

    return <span className={textClassName}>{value?.toString() || "Ikke angivet"}</span>;
}

function renderEditMode(
    key: keyof Blog_UpdateDTO,
    editedData: Blog_DTO,
    setEditedData: (data: Blog_DTO) => void,
    className: string
): ReactNode {
    if (key === "authorId") {
        return <span className="text-zinc-500 italic">Ikke redigerbar</span>;
    }

    if (key === "content") {
        return (
            <BlogLexicalEditor
                value={editedData.content || ""}
                onChange={(html) => setEditedData({ ...editedData, content: html })}
                blogId={editedData.id} // <-- TILFØJ DETTE
                existingPhotos={editedData.photos || []} // <-- OG DETTE
            />
        );
    }

    if (key === "visibilityLevel") {
        return (
            <Select
                id={`${key}-input`}
                selectedKeys={editedData[key] ? [editedData[key]] : []}
                onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setEditedData({ ...editedData, [key]: selectedKey });
                }}
                className={className}
                placeholder="Vælg synlighed"
            >
                {visibilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </Select>
        );
    }

    if (key === "metaDescription" || key === "tags") {
        return (
            <Textarea
                id={`${key}-input`}
                value={editedData[key]?.toString() || ""}
                onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                className={className}
                placeholder={key === "metaDescription" ? "SEO beskrivelse..." : "Komma-separerede tags..."}
                minRows={2}
                maxRows={4}
            />
        );
    }

    // Standard tekst input
    return (
        <Input
            id={`${key}-input`}
            value={editedData[key]?.toString() || ""}
            onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
            className={className}
            placeholder={`Indtast ${editableFieldLabels[key].toLowerCase()}`}
        />
    );
}