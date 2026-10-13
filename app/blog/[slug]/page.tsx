import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Markdown from "@/components/Markdown";
import { CtaBand } from "@/components/sections";
import { formatDate, getArticle, getArticles, getRelated } from "@/lib/blog";
import { publicationHash } from "@/lib/publication";
import { siteOrigin } from "@/lib/origin";
import { site } from "@/lib/site";

// Only published, non-future articles get a page; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

const absolute = (src: string) => (src.startsWith("http") ? src : `${siteOrigin()}${src}`);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `${siteOrigin()}/blog/${article.slug}`;
  return {
    title: { absolute: `${article.title} | Falcon Urgent Delivery` },
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
      siteName: site.name,
      publishedTime: article.publishedAt,
      images: [{ url: absolute(article.coverImage), alt: article.coverAlt }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [absolute(article.coverImage)] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = getRelated(article.slug);
  const url = `${siteOrigin()}/blog/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [absolute(article.coverImage)],
    datePublished: article.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: site.name, url: siteOrigin() },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${siteOrigin()}/android-chrome-512.png` },
    },
  };

  return (
    <>
      <article data-publication-hash={publicationHash(article)} className="blog-article">
        <header className="bg-navy pb-36 pt-10 text-white md:pb-44 md:pt-14">
          <div className="container-x max-w-3xl">
            <p>
              <Link href="/blog" className="font-semibold text-white/75 underline-offset-4 hover:text-white hover:underline">
                Blog
              </Link>
            </p>
            <h1>{article.title}</h1>
            <p className="mt-5 text-lg text-white/80">{article.description}</p>
            <p className="mt-4 text-sm text-white/65">
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              <span aria-hidden> &nbsp;|&nbsp; </span>
              {site.name}
            </p>
          </div>
        </header>
        <div className="container-x max-w-4xl">
          <img
            src={article.coverImage}
            alt={article.coverAlt}
            fetchPriority="high"
            decoding="async"
            className="-mt-28 aspect-[16/9] w-full rounded-xl object-cover shadow-[0_24px_48px_-20px_rgba(13,27,42,0.45)] md:-mt-36"
          />
        </div>
        <div className="container-x max-w-3xl py-12 md:py-16">
          <div className="blog-body">
            <Markdown>{article.body}</Markdown>
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>

      {related.length > 0 && (
        <section className="bg-sand py-16 md:py-20" aria-labelledby="related-title">
          <div className="container-x">
            <h2 id="related-title" className="mb-8 text-4xl">
              More from the blog
            </h2>
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} headingLevel="h3" />
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
