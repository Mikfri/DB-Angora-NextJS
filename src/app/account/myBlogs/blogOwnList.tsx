// src/app/account/myBlogs/blogOwnList.tsx

'use client';
import { useEffect, useState } from 'react';
import { fetchBlogsAuthoredByUserAction } from '@/app/actions/blog/blogActions';
import type { Blog_CardDTO } from '@/api/types/AngoraDTOs';
import BlogPreviewCard from '@/components/cards/blogPreviewCard';

export default function BlogOwnList({ userId }: { userId: string }) {
  const [blogs, setBlogs] = useState<Blog_CardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchBlogsAuthoredByUserAction(userId)
      .then(result => {
        if (result.success) {
          setBlogs(result.data.data);
        } else {
          let msg = result.error;
          // Hvis fejlen starter med 'Fejl ved hentning...' og indeholder JSON, så parse kun JSON-delen
          const match = msg.match(/\{.*\}$/);
          if (match) {
            try {
              const parsed = JSON.parse(match[0]);
              if (parsed.message) msg = parsed.message;
            } catch {
              // ignore
            }
          }
          // Dekod unicode (fx \u00E6 -> æ)
          msg = msg.replace(/\\u([\dA-F]{4})/gi, (_, code) =>
            String.fromCharCode(parseInt(code, 16))
          );
          setError(msg);
        }
        setLoading(false);
      });
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-zinc-300">Indlæser dine blogs...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-900/80 border border-red-700/50 rounded-xl p-6 my-6">
      <h2 className="text-xl font-bold text-red-300 mb-2">Fejl</h2>
      <p className="text-red-200">{error}</p>
    </div>
  );

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
      <h2 className="text-2xl font-bold text-zinc-300 mb-4">Blogs for bruger: {userId}</h2>
      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400">Ingen blogs fundet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map(blog => (
            <BlogPreviewCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}