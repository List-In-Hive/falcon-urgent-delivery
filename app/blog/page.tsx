import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { PageHero } from "@/components/sections";
import { getArticles } from "@/lib/blog";
import { siteOrigin } from "@/lib/origin";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: "Courier Tips for Las Vegas Businesses | Falcon Urgent Delivery Blog" },
    description: "Practical guides on rush and same-day delivery in Las Vegas: documents, auto parts, packaging and getting it there on time.",
    alternates: { canonical: `${siteOrigin()}/blog` },
  };
}

export default function BlogPage() {
  const articles = getArticles();
  return (
    <>
      <PageHero title="Blog" intro="Practical delivery tips for Las Vegas businesses, from the Falcon team." />
      <section className="bg-sand py-16 md:py-24">
        <div className="container-x">
          {articles.length ? (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-line bg-white p-10 text-center">
              <p className="font-display text-3xl font-bold">No articles yet</p>
              <p className="mx-auto mt-2 max-w-md text-slate">Our first delivery guides are on the way. In the meantime, see how pricing works.</p>
              <Link href="/services" className="btn btn-red mt-6">
                Services &amp; pricing
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
