import Link from "next/link";

export default function NotFound() {
  return (
    <section className="edge-angle bg-navy pb-28 pt-16 text-white">
      <div className="container-x">
        <p className="font-display text-7xl font-extrabold text-red">404</p>
        <h1 className="mt-2 text-5xl md:text-6xl">This page took a wrong turn.</h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">The address may be mistyped, or the page has moved.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ghost-light">
            Go to the home page
          </Link>
          <Link href="/order" className="btn btn-red">
            Get a Price
          </Link>
        </div>
      </div>
    </section>
  );
}
