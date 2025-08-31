// src/app/account/myBlogs/blogWorkspace/[blogId]/blogWorkspace.tsx
'use client';

import { Blog_DTO } from '@/api/types/AngoraDTOs';
import { Tabs, Tab, Button } from "@heroui/react";
import { useState, useMemo, useEffect } from 'react';
import { useNav } from "@/components/providers/Providers";
import MyNav from "@/components/nav/side/index/MyNav";

// Import ikoner for hver tab
import { RiEditLine, RiSettingsLine, RiEyeLine, RiImageLine, RiSendPlaneLine } from "react-icons/ri";

// Placeholder komponenter indtil de relle komponenter er lavet
const BlogEditor = ({ blog }: { blog: Blog_DTO }) => (
  <div className="p-4 bg-zinc-700/50 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">Blog Editor</h3>
    <p className="text-zinc-300">Editor kommer her... Blog ID: {blog.id}</p>
  </div>
);

const BlogSettings = ({ blog }: { blog: Blog_DTO }) => (
  <div className="p-4 bg-zinc-700/50 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">Blog Indstillinger</h3>
    <p className="text-zinc-300">Indstillinger kommer her... Blog ID: {blog.id}</p>
  </div>
);

const BlogImageSection = ({ blogId }: { blogId: number }) => (
  <div className="p-4 bg-zinc-700/50 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">Blog Billeder</h3>
    <p className="text-zinc-300">Billede håndtering kommer her... Blog ID: {blogId}</p>
  </div>
);

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
  const { setSecondaryNav } = useNav();

  // Sekundær navigation
  const secondaryNavComponent = useMemo(() => (
    <MyNav key="secondary-nav" />
  ), []);

  useEffect(() => {
    setSecondaryNav(secondaryNavComponent);
    return () => {
      setSecondaryNav(null);
    };
  }, [setSecondaryNav, secondaryNavComponent]);

  const displayTitle = initialBlog.title || 'Nyt blogindlæg';
  
  // Ret publishStatus fejl - brug korrekt property navn fra Blog_DTO
  const publishStatus = initialBlog.isPublished ? 'Publiceret' : 'Kladde';

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
        
        <div className="flex gap-2">
          <Button 
            color="secondary" 
            variant="ghost"
            size="sm"
          >
            Gem som kladde
          </Button>
          <Button 
            color="primary" 
            size="sm"
          >
            Publicer
          </Button>
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
          <BlogEditor blog={initialBlog} />
        </Tab>

        <Tab
          key="settings"
          title={
            <div className="flex items-center space-x-2">
              <RiSettingsLine className="text-xl" />
              <span>Indstillinger</span>
            </div>
          }
        >
          <BlogSettings blog={initialBlog} />
        </Tab>

        <Tab
          key="images"
          title={
            <div className="flex items-center space-x-2">
              <RiImageLine className="text-xl" />
              <span>Billeder</span>
            </div>
          }
        >
          <BlogImageSection blogId={initialBlog.id} />
        </Tab>

        <Tab
          key="preview"
          title={
            <div className="flex items-center space-x-2">
              <RiEyeLine className="text-xl" />
              <span>Forhåndsvisning</span>
            </div>
          }
        >
          <BlogPreview blog={initialBlog} />
        </Tab>

        <Tab
          key="publishing"
          title={
            <div className="flex items-center space-x-2">
              <RiSendPlaneLine className="text-xl" />
              <span>Publicering</span>
            </div>
          }
        >
          <BlogPublishing blog={initialBlog} />
        </Tab>
      </Tabs>
    </div>
  );
}