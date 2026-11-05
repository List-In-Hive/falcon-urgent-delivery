"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";

/** Sticky "Call" + "Get a Price" bar on phones, on every page except the order flow. */
export default function MobileCTA() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/order")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[auto_1fr] gap-2 border-t border-white/10 bg-navy/95 p-3 backdrop-blur sm:hidden">
      <a href={site.phoneHref} className="btn btn-ghost-light px-4" aria-label={`Call ${site.phone}`}>
        <Phone aria-hidden size={19} /> Call
      </a>
      <Link href="/order" className="btn btn-red w-full">
        Get a Price
      </Link>
    </div>
  );
}
