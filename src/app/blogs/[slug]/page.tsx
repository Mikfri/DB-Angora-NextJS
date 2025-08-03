// src/app/blogs/[slug]/page.tsx

import { fetchBlogBySlugAction } from '@/app/actions/blog/blogActions';
import BlogPost from './blogPost';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Await params i Next.js 15+
  const blog = await fetchBlogBySlugAction(slug);

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-zinc-400">
        <h2 className="text-2xl font-bold mb-2">Blogindlæg ikke fundet</h2>
        <p>Opslaget findes ikke, eller du har ikke adgang.</p>
      </div>
    );
  }

  return <BlogPost blog={blog} />;
}