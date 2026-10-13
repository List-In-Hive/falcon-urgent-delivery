import Link from "next/link";
import { formatDate, type Article } from "@/lib/blog";

export default function ArticleCard({ article, headingLevel = "h2" }: { article: Article; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-line">
      <img
        src={article.coverImage}
        alt={article.coverAlt}
        loading="lazy"
        decoding="async"
        className="aspect-[16/9] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={article.publishedAt} className="text-sm text-slate">
          {formatDate(article.publishedAt)}
        </time>
        <Heading className="mt-2 text-[1.75rem] leading-tight">
          <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-red-dark">
            {article.title}
          </Link>
        </Heading>
        <p className="mt-3 flex-1 text-[#2b3a4a]">{article.description}</p>
        <span aria-hidden className="mt-5 font-semibold text-red underline underline-offset-4">
          Read the article
        </span>
      </div>
    </li>
  );
}
