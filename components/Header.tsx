"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so it closes by itself after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn !== null && openOn === pathname;

  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label="Falcon Urgent Delivery, home">
          <img src="/brand/falcon-logo-reversed.svg" alt="" width={170} height={48} className="h-10 w-auto md:h-11" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-[1.0625rem] font-medium transition-colors hover:text-white ${
                      active ? "text-white underline decoration-red decoration-2 underline-offset-[10px]" : "text-white/75"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/order" className="btn btn-red hidden sm:inline-flex">
            Get a Price
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white hover:bg-navy-3 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <X aria-hidden size={26} /> : <Menu aria-hidden size={26} />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-white/10 bg-navy lg:hidden">
          <ul className="container-x flex flex-col py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 font-display text-2xl font-bold text-white"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 pb-2">
              <Link href="/order" className="btn btn-red w-full">
                Get a Price
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
