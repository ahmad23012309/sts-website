import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { getPricingRules } from "@/lib/cms";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Payment Terms and Plans",
  description:
    "How to pay, what is due up front, long-stay discounts, corporate credit terms and what the security deposit covers.",
  path: "/payment-plans",
});

export default async function PaymentPlansPage() {
  const l = site.legal;
  const rules = await getPricingRules();

  return (
    <>
      <LegalPage
        eyebrow="Payments"
        title="Payment Terms and Plans"
        intro="What you pay, when, and by which method. Nothing is taken when you send a request; payment starts once the booking is confirmed."
      >
        <h2>1. Nothing is charged to make a request</h2>
        <p>
          Sending a booking request or using the fare calculator takes no
          payment and no card details. We confirm the vehicle and the final
          price with you first.
        </p>

        <h2>2. What is due, and when</h2>
        <h3>Individual rentals</h3>
        <ul>
          <li>
            <strong>{l.advancePercent}% advance</strong> to confirm the booking.
          </li>
          <li>The balance at handover, before the vehicle leaves.</li>
          <li>
            A refundable <strong>security deposit</strong> on self-drive
            rentals, shown on each vehicle&rsquo;s page and returned after
            check-in.
          </li>
        </ul>

        <h3>Corporate accounts</h3>
        <ul>
          <li>
            Monthly invoicing against your purchase order, with trips itemised.
          </li>
          <li>
            Standard credit terms of <strong>{l.corporateCreditDays} days</strong>{" "}
            from the invoice date, agreed when the account is opened.
          </li>
          <li>No security deposit where a contract is in place.</li>
        </ul>

        <h2>3. How you can pay</h2>
        <ul>
          {l.paymentMethods.map((method) => (
            <li key={method}>{method}</li>
          ))}
        </ul>
        <p>
          Online card payment is not yet available on this website. When it is,
          this page will say so and the booking flow will offer it.
        </p>

        <h2>4. Long-stay discounts</h2>
        <p>
          The daily rate falls as the rental runs longer. The discount applies
          to the vehicle rate only: fuel and driver allowances do not fall with
          time, so they are charged as normal.
        </p>
        <table>
          <thead>
            <tr>
              <th>Rental length</th>
              <th>Discount on the daily rate</th>
            </tr>
          </thead>
          <tbody>
            {[...rules.longStayDiscounts]
              .sort((a, b) => a.minDays - b.minDays)
              .map((band) => (
                <tr key={band.minDays}>
                  <th scope="row">{band.minDays} days and over</th>
                  <td>{band.percent}%</td>
                </tr>
              ))}
          </tbody>
        </table>
        <p>
          The{" "}
          <Link href="/fare-calculator" className="text-accent underline underline-offset-2">
            fare calculator
          </Link>{" "}
          applies these automatically, so you can see the effect before you
          book.
        </p>

        <h2>5. What the security deposit covers</h2>
        <p>
          The deposit is held against fuel shortfall, traffic fines, tolls,
          late-return charges and damage beyond fair wear. It is not a payment
          towards the rental. Anything not used is returned after the vehicle
          has been checked in; where a deduction is made, you get an itemised
          account of it.
        </p>

        <h2>6. The with-fuel rate and the fuel price</h2>
        <p>
          A with-fuel rate is calculated against the notified fuel price on the
          day, published on our{" "}
          <Link href="/fuel-prices" className="text-accent underline underline-offset-2">
            fuel prices page
          </Link>
          . If the price is revised between your quote and your rental, the rate
          is recalculated and we tell you before you commit.
        </p>

        <h2>7. Service charge and taxes</h2>
        <p>
          A service charge of {rules.marginPercent}% is included in the quoted
          figure rather than added at the end. Any government taxes or levies
          that apply are shown separately on the invoice.
        </p>

        <h2>8. Late payment on corporate accounts</h2>
        <p>
          Where an invoice passes its due date we will contact the named account
          holder before anything else happens. Repeated late payment may lead to
          the account being put back onto advance terms, with notice.
        </p>

        <h2>9. Receipts and invoices</h2>
        <p>
          A receipt is issued for every payment, and corporate accounts receive
          a monthly invoice with the trips itemised. Ask{" "}
          <a href={`mailto:${site.contact.emailCorporate}`} className="text-accent underline underline-offset-2">
            {site.contact.emailCorporate}
          </a>{" "}
          for a duplicate at any time.
        </p>

        <p>
          See also our{" "}
          <Link href="/cancellation-policy" className="text-accent underline underline-offset-2">
            cancellation policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-accent underline underline-offset-2">
            terms and conditions
          </Link>
          .
        </p>
      </LegalPage>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Payment Plans", path: "/payment-plans" },
        ])}
      />
    </>
  );
}
