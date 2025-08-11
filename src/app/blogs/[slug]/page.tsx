// src/app/blogs/[slug]/page.tsx

import { fetchBlogBySlugAction } from '@/app/actions/blog/blogActions';
import BlogPost from './blogPost';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await fetchBlogBySlugAction(slug);

  if (!result.success) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-zinc-400">
        <h2 className="text-2xl font-bold mb-2">Blogindlæg ikke fundet</h2>
        <p>Opslaget findes ikke, eller du har ikke adgang.</p>
      </div>
    );
  }

  const blog = result.data;

  // Article schema for Google
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "alternativeHeadline": blog.subTitle || undefined,
    "image": blog.featuredImageUrl || undefined,
    "author": {
      "@type": "Person",
      "name": blog.authorName
    },
    /* Organization type fordi vi (DB-Angora) i denne kontekst fungerer som en publisher af en artikel.
     Derudover forventer Google også der ved "@type": "Article" enten er:
     'Person' eller 'Organization' som Publisher*/
    "datePublished": blog.publishDate,
    "publisher": {
      "@type": "Organization", 
      "name": "DenBlå-Angora",
      "logo": {
        "@type": "ImageObject",
        "url": "https://db-angora.dk/images/DB-Angora.png"
      }
    },
    "description": blog.subTitle || blog.title,
    "articleBody": blog.content?.replace(/<[^>]+>/g, '').slice(0, 200), // Kort uddrag uden HTML
    "keywords": blog.tags || undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPost blog={blog} />
    </>
  );
}