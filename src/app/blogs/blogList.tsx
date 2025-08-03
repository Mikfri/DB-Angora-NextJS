// src/app/blogs/blogList.tsx

import Image from 'next/image';
import type { Blog_CardDTO, PagedResultDTO } from '@/api/types/AngoraDTOs';
import { ROUTES } from '@/constants/navigation';

interface Props {
  blogs: Blog_CardDTO[];
  paging?: PagedResultDTO<Blog_CardDTO>;
}

export default function BlogList({ blogs, paging }: Props) {
  if (blogs.length === 0) {
    return (
      <div className="bg-zinc-800/80 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
        <h2 className="text-2xl font-bold text-zinc-200 mb-2">
          Ingen blogindlæg fundet
        </h2>
        <p className="text-zinc-400 mb-6">
          Kom tilbage senere for flere spændende opslag!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800/80 rounded-xl border border-zinc-700/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <a
              key={blog.id}
              href={ROUTES.BLOGS.BLOG(blog.slug)}
              className="cursor-pointer bg-zinc-900 rounded-lg p-4 hover:bg-zinc-700 transition flex flex-col no-underline"
            >
              {blog.featuredImageUrl && (
                <Image
                  src={blog.featuredImageUrl}
                  alt={blog.title}
                  width={800} // eller passende bredde
                  height={256} // eller passende højde
                  className="w-full h-64 object-cover rounded mb-6"
                />
              )}
              <h3 className="text-lg font-bold text-zinc-100 mb-2">{blog.title}</h3>
              <p className="text-zinc-400 mb-2">{blog.contentSummary}</p>
              <div className="text-xs text-zinc-500 mb-1">
                {blog.authorName} • {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : ''}
              </div>
              <div className="text-xs text-zinc-400 italic">
                Synlighed: {blog.blogVisibility}
              </div>
            </a>
          ))}
        </div>
      </div>
      {paging && paging.totalPages > 1 && (
        <div className="text-center text-xs text-zinc-400 mt-4">
          Side {paging.page} af {paging.totalPages}
        </div>
      )}
    </div>
  );
}