import type { Metadata } from "next";
import DriverApp from "@/components/DriverApp";

export const metadata: Metadata = {
  title: "Driver",
  robots: { index: false, follow: false },
};

export default function DriverPage() {
  return (
    <section className="min-h-[70vh] bg-sand py-8 md:py-12">
      <div className="container-x max-w-2xl">
        <DriverApp />
      </div>
    </section>
  );
}
