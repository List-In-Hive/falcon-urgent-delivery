import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";

// Article bodies are plain Markdown. Raw HTML is skipped (skipHtml), and a Markdown "# H1" is
// rendered as an H2 so the article page always has exactly one H1 (the title).
const components: Components = {
  h1: ({ children }) => <h2>{children}</h2>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  img: ({ src, alt }) => (
    <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" sizes="(min-width: 768px) 720px, 100vw" />
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown skipHtml components={components}>
      {children}
    </ReactMarkdown>
  );
}
