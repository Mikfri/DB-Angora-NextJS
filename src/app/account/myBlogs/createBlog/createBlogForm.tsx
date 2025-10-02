// src/app/account/myBlogs/createBlog/createBlogForm.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { createBlogAction } from '@/app/actions/blog/blogActions';
import type { Blog_CreateDTO } from '@/api/types/AngoraDTOs';

// Genbrug LexicalEditor fra workspace
import BlogLexicalEditor from '@/app/account/myBlogs/blogWorkspace/[blogId]/LexicalEditor';

const VISIBILITY_OPTIONS = [
    { value: 'Public', label: 'Offentlig' },
    { value: 'PaidContent', label: 'Betalt indhold' }
];

export default function CreateBlogForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<Blog_CreateDTO, 'content'>>({
        title: '',
        subtitle: '',
        visibilityLevel: 'Public',
        tags: ''
    });
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await createBlogAction({
            ...formData,
            content
        });
        if (result.success) {
            router.push(`/account/myBlogs/blogWorkspace/${result.data.id}`);
        } else {
            setError(result.error || 'Der skete en fejl ved oprettelse af blogindlæg.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md rounded-xl border border-zinc-700/50 p-4">
            <h1 className="text-2xl font-bold text-zinc-100 mb-4">Opret ny blog</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Titel"
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    required
                />
                <Input
                    label="Undertitel"
                    value={formData.subtitle || ''}
                    onChange={e => handleChange('subtitle', e.target.value)}
                />
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Indhold</label>
                    <BlogLexicalEditor
                        value={content}
                        onChange={setContent}
                        blogId={0} // blogId=0, da bloggen ikke eksisterer endnu
                        existingPhotos={[]} // Ingen billeder før blog er oprettet
                        //showImageButton={false} // Skjul billede-upload hvis din editor understøtter det
                    />
                </div>
                <Select
                    label="Synlighed"
                    selectedKeys={[formData.visibilityLevel]}
                    onSelectionChange={keys => handleChange('visibilityLevel', Array.from(keys)[0] as string)}
                >
                    {VISIBILITY_OPTIONS.map(opt => (
                        <SelectItem key={opt.value}>{opt.label}</SelectItem>
                    ))}
                </Select>
                <Input
                    label="Tags (kommasepareret)"
                    value={formData.tags || ''}
                    onChange={e => handleChange('tags', e.target.value)}
                />
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <div className="flex gap-2 justify-end">
                    <Button
                        color="danger"
                        variant="flat"
                        onPress={() => router.back()}
                        type="button"
                        disabled={isSubmitting}
                    >
                        Annuller
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? 'Opretter...' : 'Opret'}
                    </Button>
                </div>
            </form>
        </div>
    );
}