import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";

export default function Faq({ limit, withSchema = false }: { limit?: number; withSchema?: boolean }) {
  const items = limit ? faqs.slice(0, limit) : faqs;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.375rem] font-bold leading-snug">{f.q}</span>
            <Plus aria-hidden className="shrink-0 text-red transition-transform group-open:rotate-45" size={24} />
          </summary>
          <p className="max-w-[65ch] pb-6 text-[#2b3a4a]">{f.a}</p>
        </details>
      ))}
      {withSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    </div>
  );
}
