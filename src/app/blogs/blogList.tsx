// src/app/blogs/blogList.tsx

import type { BlogCardPreviewDTO, ResultPagedDTO } from '@/api/types/AngoraDTOs';
import BlogPreviewCard from '@/components/cards/blogPreviewCard';

interface Props {
  blogs: BlogCardPreviewDTO[];
  paging?: ResultPagedDTO<BlogCardPreviewDTO>;
}

export default function BlogList({ blogs, paging }: Props) {
  if (blogs.length === 0) {
    return (
      <div className="rounded-xl border border-divider bg-surface-secondary p-6 text-center py-16">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Ingen blogindlæg fundet
        </h2>
        <p className="text-muted mb-6">
          Kom tilbage senere for flere spændende opslag!
        </p>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      <h2 className="text-2xl font-bold text-foreground mb-4">Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogPreviewCard key={blog.id} blog={blog} />
        ))}
      </div>
      {paging && paging.totalPages > 1 && (
        <div className="text-center text-xs text-muted mt-4">
          Side {paging.page} af {paging.totalPages}
        </div>
      )}
    </div>
  );
}
