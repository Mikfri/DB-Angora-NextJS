// src/app/account/myBlogs/blogOwnList.tsx

'use client';

import { useEffect } from 'react';
import { useBlogOwnedStore } from '@/store/BlogOwnedStore';
import { ROUTES } from '@/constants/navigationConstants';
import { useRouter } from 'next/navigation';
import BlogOwnPreviewCard from '@/components/cards/blogOwnPreviewCard';
import { Button } from '@heroui/react';
import { RiRefreshLine } from 'react-icons/ri';

export default function BlogOwnList({ userId }: { userId: string }) {
  const router = useRouter();

  const {
    setUserId,
    reloadAll,
    blogs,
    blogsCount,
    loading,
    error,
    pagination,
    setPage,
    setPageSize,
    initialized
  } = useBlogOwnedStore();

  // Init hent alle blogs én gang pr user
  useEffect(() => {
    void setUserId(userId);
  }, [userId, setUserId]);

  const handleBlogClick = (blogId: number) => {
    router.push(ROUTES.ACCOUNT.BLOG_WORKSPACE(blogId));
  };

  const onRetry = () => {
    void reloadAll();
  };

  const totalPages = pagination.totalPages;

  if (loading && !initialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-muted">Indlæser dine blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/80 border border-red-700/50 rounded-xl p-6 my-6">
        <h2 className="text-xl font-bold text-red-300 mb-2">Fejl</h2>
        <p className="text-red-200 mb-4">{error}</p>
        <Button
          size="sm"
          variant="ghost"
          className="text-warning"
          onPress={onRetry}
        >
          <RiRefreshLine /> Forsøg igen
        </Button>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Dine blogs</h2>
        <div className="text-sm text-muted">
          {blogsCount} i alt
        </div>
      </div>

      {loading && (
        <div className="text-xs text-muted mb-3">Opdaterer…</div>
      )}

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted">Ingen blogs matcher filtrene.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map(blog => (
              <BlogOwnPreviewCard
                key={blog.id}
                blog={blog}
                onClick={() => handleBlogClick(blog.id)}
              />
            ))}
          </div>

          {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={pagination.page <= 1}
                  onPress={() => setPage(pagination.page - 1)}
                >
                  Forrige
                </Button>
                <span className="text-xs text-muted">
                  Side {pagination.page} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={pagination.page >= totalPages}
                  onPress={() => setPage(pagination.page + 1)}
                >
                  Næste
                </Button>
                <select
                  className="text-xs bg-surface-secondary border border-divider rounded px-2 py-1 ml-2 text-foreground"
                  value={pagination.pageSize}
                  onChange={e => setPageSize(parseInt(e.target.value, 10))}
                >
                  {[6, 12, 24, 48].map(s => (
                    <option key={s} value={s}>{s}/side</option>
                  ))}
                </select>
              </div>
            )}
        </>
      )}
    </div>
  );
}
