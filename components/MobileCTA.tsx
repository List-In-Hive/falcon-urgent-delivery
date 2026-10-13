"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Sticky "Get a Price" bar on phones, on every page except the order flow and driver page. */
export default function MobileCTA() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/order") || pathname.startsWith("/driver")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy/95 p-3 backdrop-blur sm:hidden">
      <Link href="/order" className="btn btn-red w-full">
        Get a Price
      </Link>
    </div>
  );
}
