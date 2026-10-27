import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections";
import { prohibitedItems, site } from "@/lib/site";
import { INCLUDED_VALUE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: { absolute: "Terms of Use | Falcon Urgent Delivery" },
  description: "The terms for using falconurgentdelivery.com and booking deliveries with Falcon Urgent Delivery, including refunds.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "October 13, 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Use" intro={`Last updated ${UPDATED}`} />
      <article className="container-x prose-legal max-w-3xl py-14 md:py-20">
        <h2>1. Agreement</h2>
        <p>
          By using falconurgentdelivery.com or booking a delivery with Falcon Urgent Delivery (&quot;Falcon&quot;, &quot;we&quot;), you agree to
          these terms. You must be at least 18 years old and able to make agreements on behalf of yourself or your business.
        </p>

        <h2>2. Our services</h2>
        <ul>
          <li>
            <strong>Rush / Urgent:</strong> picked up and delivered within 60 to 90 minutes.
          </li>
          <li>
            <strong>Same Day:</strong> ordered by 2 PM and delivered by the end of the business day.
          </li>
          <li>Our service area covers trips of up to 25 miles in the Las Vegas valley. Anything else is priced by quote.</li>
        </ul>

        <h2>3. Booking and prices</h2>
        <ul>
          <li>Online prices come from our published price table, based on the item, speed and distance you select.</li>
          <li>You are responsible for giving accurate details: item size and weight, addresses, contacts and timing.</li>
          <li>
            Distance is the driving distance from pickup to drop-off. If the actual distance falls in a higher price band than the one you
            selected, we will contact you before pickup to collect the difference, or give you a full refund if you cancel.
          </li>
          <li>Quotes are valid for 24 hours.</li>
          <li>We do not charge for waiting time.</li>
        </ul>

        <h2>4. Payment</h2>
        <p>
          Online bookings are paid by card through Stripe when you book. Quoted deliveries are paid through a secure payment link. We
          dispatch a delivery only after payment is received.
        </p>

        <h2 id="refunds">5. Cancellations and refunds</h2>
        <ul>
          <li>Cancel before pickup and you get a full refund.</li>
          <li>Once your item has been picked up, the delivery cannot be refunded.</li>
          <li>Refunds go back to the original card through Stripe. Your bank may take a few business days to show it.</li>
          <li>
            To cancel, email <a href={`mailto:${site.email}`}>{site.email}</a> with your Order ID.
          </li>
        </ul>

        <h2>6. Delivery times</h2>
        <p>
          We commit to the stated delivery windows under normal conditions. We are not responsible for delays caused by traffic, weather,
          road closures, events outside our control, or wrong or incomplete information.
        </p>

        <h2>7. Undeliverable items</h2>
        <p>
          If the recipient is unavailable or refuses the item, we will contact you. A return trip or second delivery attempt is quoted
          separately.
        </p>

        <h2>8. Packaging</h2>
        <p>You are responsible for packing and sealing items properly. We may refuse items that are poorly packed.</p>

        <h2>9. Prohibited items</h2>
        <p>We do not carry:</p>
        <ul>
          {prohibitedItems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p>
          We may refuse any item. You are responsible for any loss, damage or cost caused by an item you misdeclared or that is on this
          list.
        </p>

        <h2>10. Liability</h2>
        <ul>
          <li>
            Each delivery is covered up to ${INCLUDED_VALUE}, unless a higher declared value has been agreed with us in advance by quote.
          </li>
          <li>We are not liable for indirect, incidental or consequential losses, such as lost profits or missed deadlines.</li>
          <li>
            Claims for loss or damage must be sent within 7 days of the delivery date to <a href={`mailto:${site.email}`}>{site.email}</a>,
            with the Order ID and photos.
          </li>
        </ul>

        <h2>11. Proof of delivery</h2>
        <p>The delivery time and the name of the person who received the item count as proof of delivery.</p>

        <h2>12. Using our website</h2>
        <p>
          The content of this website belongs to Falcon. Do not misuse the site: no scraping, interference with its operation, or false or
          fraudulent orders.
        </p>

        <h2>13. Disclaimers and indemnity</h2>
        <p>
          Except as stated in these terms, our website and services are provided &quot;as is&quot;. You agree to cover any claims, losses or
          costs that result from your breach of these terms or from items you send.
        </p>

        <h2>14. Governing law</h2>
        <p>These terms are governed by the laws of the State of Nevada. Any dispute will be heard in the courts of Clark County, Nevada.</p>

        <h2>15. Changes and contact</h2>
        <p>
          We may update these terms. The version on this page applies to bookings made while it is posted. Questions go to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. See also our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </article>
    </>
  );
}
