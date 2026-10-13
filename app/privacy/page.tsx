import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | Falcon Urgent Delivery" },
  description: "How Falcon Urgent Delivery collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "October 13, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" intro={`Last updated ${UPDATED}`} />
      <article className="container-x prose-legal max-w-3xl py-14 md:py-20">
        <p>
          This policy explains what information Falcon Urgent Delivery (&quot;Falcon&quot;, &quot;we&quot;) collects through
          falconurgentdelivery.com and when you book a delivery, how we use it, and the choices you have. Questions go to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Your name, company, email address and phone number.</li>
          <li>Pickup and drop-off addresses, and the names and phone numbers of the people at each end.</li>
          <li>Descriptions of the items you send and any declared value.</li>
          <li>Delivery records: pickup and delivery times, the name of the person who received the item, and a photo of the delivered item.</li>
          <li>Messages you send us through our forms or by email.</li>
          <li>Basic technical data our hosting provider records automatically, such as IP address, browser type and pages visited.</li>
        </ul>

        <h2>Payments</h2>
        <p>
          Card payments are processed by Stripe. Your card number goes directly to Stripe; we never see or store it. Stripe&apos;s use of your
          information is covered by its own privacy policy.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To price, book and complete your deliveries.</li>
          <li>To send receipts, delivery updates and proof of delivery.</li>
          <li>To answer your questions and quote requests.</li>
          <li>To prevent fraud and keep our service secure.</li>
          <li>To meet our legal, tax and accounting obligations.</li>
        </ul>

        <h2>Who we share it with</h2>
        <p>
          We share information only with service providers that help us run the business: Stripe (payments), Netlify (website hosting, forms
          and storage) and Resend (email delivery). They may use it only to provide their services to us. We may also disclose information
          when the law requires it. <strong>We do not sell your personal information.</strong>
        </p>

        <h2>Cookies and tracking</h2>
        <p>
          Our website uses only cookies that are needed for it to work, such as the sign-in cookie on our driver page. We do not use
          advertising cookies. Third parties are not allowed to collect information about your online activities over time and across
          different websites through our site.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep order records and delivery photos for 12 months, then delete them. Payment records are kept for as long as tax law
          requires.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask to see, correct or delete the personal information we hold about you by emailing{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Nevada residents may submit a verified request asking us not to sell their
          covered information. We do not sell it, but we will confirm your request.
        </p>

        <h2>Security</h2>
        <p>
          We use reasonable safeguards to protect your information, including encrypted connections and access controls. No system is
          completely secure, so we cannot guarantee absolute security.
        </p>

        <h2>Children</h2>
        <p>Our service is for businesses and adults. It is not directed at children under 13, and we do not knowingly collect their information.</p>

        <h2>Changes to this policy</h2>
        <p>
          If we change this policy, we will post the new version on this page and update the date at the top. Significant changes will be
          highlighted on our website.
        </p>

        <h2>Contact</h2>
        <p>
          Falcon Urgent Delivery, Las Vegas, Nevada. Email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </article>
    </>
  );
}
