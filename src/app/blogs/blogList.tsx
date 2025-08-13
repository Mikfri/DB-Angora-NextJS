// src/app/blogs/blogList.tsx

import type { Blog_CardDTO, PagedResultDTO } from '@/api/types/AngoraDTOs';
import BlogPreviewCard from '@/components/cards/blogPreviewCard';

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
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
      <h2 className="text-2xl font-bold text-zinc-300 mb-4">Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogPreviewCard key={blog.id} blog={blog} />
        ))}
      </div>
      {paging && paging.totalPages > 1 && (
        <div className="text-center text-xs text-zinc-400 mt-4">
          Side {paging.page} af {paging.totalPages}
        </div>
      )}
    </div>
  );
}