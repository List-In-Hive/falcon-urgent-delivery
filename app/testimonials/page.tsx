import type { Metadata } from "next";
import { CtaBand, PageHero, TestimonialsGrid } from "@/components/sections";

export const metadata: Metadata = {
  title: { absolute: "Customer Reviews | Falcon Urgent Delivery" },
  description: "What Las Vegas businesses say about our rush and same-day courier service.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero title="What our customers say" />
      <section className="bg-sand py-16 md:py-24">
        <div className="container-x">
          <TestimonialsGrid />
        </div>
      </section>
      <CtaBand title="Ready to book?" />
    </>
  );
}
