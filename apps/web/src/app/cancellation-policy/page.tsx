import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cancellation and Refund Policy",
  description:
    "What it costs to cancel or change a booking, how refunds are returned, and what happens if we have to cancel.",
  path: "/cancellation-policy",
});

export default function CancellationPolicyPage() {
  const l = site.legal;

  return (
    <>
      <LegalPage
        eyebrow="Legal"
        title="Cancellation and Refund Policy"
        intro="Plans change. These are the charges if yours do, written so you can work out the cost before you call rather than after."
      >
        <h2>1. Cancelling a booking</h2>
        <p>
          Charges are based on when you tell us, measured against the agreed
          pick-up time.
        </p>
        <table>
          <thead>
            <tr>
              <th>When you cancel</th>
              <th>Charge</th>
            </tr>
          </thead>
          <tbody>
            {l.cancellation.map((row) => (
              <tr key={row.window}>
                <th scope="row">{row.window}</th>
                <td>{row.charge}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Tell us by phone or WhatsApp on {site.contact.phone}, or by email to{" "}
          <a href={`mailto:${site.contact.email}`} className="text-accent underline underline-offset-2">
            {site.contact.email}
          </a>
          . The time we receive it is the time that counts, so a message is
          better than a plan to call later.
        </p>

        <h2>2. Changing a booking</h2>
        <p>
          Changing dates, the vehicle or the pick-up point costs nothing in
          itself, subject to the vehicle being free. If the change moves the
          booking to a higher rate, the difference is payable; if it moves to a
          lower one, the difference is refunded. A change requested inside 24
          hours of pick-up is treated as a cancellation and a new booking where
          we cannot accommodate it.
        </p>

        <h2>3. Shortening a rental once it has started</h2>
        <p>
          Returning the vehicle early does not refund the unused days. Where a
          long-stay discount was applied, the rate is recalculated against the
          period actually used, which may reduce or remove the discount.
        </p>

        <h2>4. No-show</h2>
        <p>
          If the vehicle is not collected within two hours of the agreed time
          and we have not heard from you, the booking is treated as cancelled
          with no refund, and the vehicle is released.
        </p>

        <h2>5. If we cancel</h2>
        <p>
          If we cannot supply the vehicle, we will offer an equivalent or better
          one at the same rate. If you would rather not take it, you are
          refunded in full. We do not charge you for our own failure to supply.
        </p>
        <p>
          Where a vehicle becomes unusable during the rental through no fault of
          yours, we replace it where we can, and refund the unused part of the
          rental where we cannot.
        </p>

        <h2>6. Events outside anyone&rsquo;s control</h2>
        <p>
          Where a rental cannot go ahead because of something neither side
          controls, such as a road closure, civil disturbance, a government
          restriction or severe weather, no cancellation charge applies and any
          advance is refunded.
        </p>

        <h2>7. How refunds are returned</h2>
        <p>
          Refunds go back by the method the payment was made, within seven
          working days of being agreed. Bank transfers depend on your
          bank&rsquo;s own timing once sent. A security deposit is returned
          separately, after the vehicle has been checked in.
        </p>

        <h2>8. Corporate contracts</h2>
        <p>
          Contract fleets and staff routes are governed by the notice period in
          the signed contract rather than by this page. Where the contract is
          silent, this policy applies.
        </p>

        <p>
          See also our{" "}
          <Link href="/terms" className="text-accent underline underline-offset-2">
            terms and conditions
          </Link>{" "}
          and{" "}
          <Link href="/payment-plans" className="text-accent underline underline-offset-2">
            payment terms
          </Link>
          .
        </p>
      </LegalPage>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cancellation Policy", path: "/cancellation-policy" },
        ])}
      />
    </>
  );
}
