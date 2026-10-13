import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-white/80 pb-24 sm:pb-0">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src="/brand/falcon-logo-reversed.svg" alt="Falcon Urgent Delivery" width={190} height={54} className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-white/70">Rush and same-day courier for Las Vegas businesses.</p>
          <p className="mt-4 inline-flex items-center gap-2 font-semibold text-white">
            <ShieldCheck aria-hidden size={20} className="text-red" /> Licensed &amp; insured
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-white">Contact</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white underline-offset-4 hover:underline">
                {site.email}
              </a>
            </li>
            {site.hours && <li>{site.hours}</li>}
            <li>
              <Link href="/contact" className="hover:text-white underline-offset-4 hover:underline">
                Send a message
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-white">Service area</h2>
          <ul className="mt-3 space-y-1">
            {site.areas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-white">Company</h2>
          <ul className="mt-3 space-y-2">
            {[
              ["/services", "Services & pricing"],
              ["/order", "Book a delivery"],
              ["/contact?topic=quote", "Request a quote"],
              ["/about", "About"],
              ["/blog", "Blog"],
              ["/privacy", "Privacy Policy"],
              ["/terms", "Terms of Use"],
              ["/terms#refunds", "Refund Policy"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white underline-offset-4 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Falcon Urgent Delivery. All rights reserved.</p>
          <p>
            Website crafted by{" "}
            <a
              href="https://inspirovatecreatives.com"
              target="_blank"
              rel="noopener"
              className="font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Inspirovate Creatives
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
