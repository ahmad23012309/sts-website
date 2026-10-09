import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";
import { getPricingRules } from "@/lib/cms";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description:
    "The terms on which we rent vehicles: who may drive, documents required, the deposit, fuel policy, late returns, damage and liability.",
  path: "/terms",
});

export default async function TermsPage() {
  const l = site.legal;
  const rules = await getPricingRules();

  return (
    <>
      <LegalPage
        eyebrow="Legal"
        title="Terms and Conditions"
        intro="These terms apply to every vehicle we rent. The rental agreement you sign at handover carries the same terms and is the governing document."
      >
        <h2>1. Who we are</h2>
        <p>
          In these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo; and
          &ldquo;{site.shortName}&rdquo; mean {site.name}, operating from{" "}
          {site.contact.city}, Pakistan. &ldquo;You&rdquo; means the person or
          company named on the rental agreement.
        </p>

        <h2>2. Who may drive</h2>
        <ul>
          <li>
            The driver must be at least {l.minimumDriverAge} years old and hold
            a valid driving licence that has been held for at least{" "}
            {l.licenceHeldMonths} months.
          </li>
          <li>
            Drivers under {l.youngDriverSurchargeUnder} may be subject to a
            surcharge, and some vehicle classes are not available to them.
          </li>
          <li>
            A licence not issued in Pakistan must be accompanied by an
            International Driving Permit where the licence is not in the Roman
            alphabet.
          </li>
          <li>
            Only the drivers named on the rental agreement may drive the
            vehicle. Allowing anyone else to drive ends the agreement
            immediately and voids any cover.
          </li>
        </ul>

        <h2>3. Documents we need</h2>
        <ul>
          <li>Original CNIC, or passport and visa for visitors.</li>
          <li>Original valid driving licence for every named driver.</li>
          <li>
            For corporate accounts: company registration documents and an
            authorised purchase order.
          </li>
        </ul>
        <p>
          We take copies for the rental file only, and handle them as described
          in our{" "}
          <Link href="/privacy-policy" className="text-accent underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>

        <h2>4. Security deposit</h2>
        <p>
          A refundable security deposit is taken before handover on self-drive
          rentals. The amount depends on the vehicle and is shown on that
          vehicle&rsquo;s page. It is returned after the vehicle is checked in,
          less any charges properly due under these terms.
        </p>

        <h2>5. Rates, fuel and what is included</h2>
        <p>
          Every vehicle carries a with-fuel and a without-fuel daily rate. The
          with-fuel rate is calculated from the distance, the vehicle&rsquo;s
          consumption and the notified fuel price on the day, which is published
          on our{" "}
          <Link href="/fuel-prices" className="text-accent underline underline-offset-2">
            fuel prices page
          </Link>
          . Because that price is revised regularly, a with-fuel quote is valid
          for the rate shown on it.
        </p>
        <p>
          <strong>Included:</strong> {site.rentalTerms.included.join("; ")}.
        </p>
        <p>
          <strong>Not included:</strong> {site.rentalTerms.excluded.join("; ")}.
        </p>
        <p>
          On a without-fuel rental the vehicle is handed over at a recorded fuel
          level and must be returned at the same level. A shortfall is charged
          at the notified price plus a refuelling charge.
        </p>

        <h2>6. Mileage and the rental day</h2>
        <p>
          A rental day is 24 hours from the time of handover. Within-city
          rentals include {rules.includedKmPerDay} kilometres per day; distance
          beyond that is charged at the vehicle&rsquo;s per-kilometre rate.
          Out-of-station travel is quoted on the route.
        </p>

        <h2>7. Late return</h2>
        <p>
          A grace period of {l.graceMinutesOnReturn} minutes applies. After
          that, overtime is charged at the vehicle&rsquo;s hourly rate, and a
          return more than six hours late is charged as a further full day.
        </p>

        <h2>8. How the vehicle may be used</h2>
        <p>The vehicle must not be:</p>
        <ul>
          <li>driven by anyone not named on the agreement;</li>
          <li>used to carry goods or passengers for hire by you;</li>
          <li>sublet, pledged or offered as security;</li>
          <li>
            used for racing, testing, driving instruction, or off-road use
            outside the vehicle&rsquo;s design;
          </li>
          <li>
            driven by anyone under the influence of alcohol or a controlled
            substance;
          </li>
          <li>
            used in the commission of an offence, or taken outside Pakistan.
          </li>
        </ul>
        <p>
          Travel outside the agreed region, including to Northern Areas or
          Balochistan, needs our written permission beforehand.
        </p>

        <h2>9. Damage, accident and breakdown</h2>
        <ul>
          <li>
            Tell us immediately, and report to the police where the law requires
            it. Do not admit liability on our behalf or authorise repairs
            without our agreement.
          </li>
          <li>
            Where the vehicle is insured, cover applies on the insurer&rsquo;s
            terms, and any excess is yours. Cover does not apply where these
            terms have been breached.
          </li>
          <li>
            Damage beyond fair wear, including tyres, glass, interior and
            upholstery, is charged at cost and may be set against the deposit.
          </li>
          <li>
            Fines, tolls and penalties incurred during the rental remain yours,
            together with an administration charge where we have to deal with
            them.
          </li>
          <li>
            If the vehicle becomes unusable through no fault of yours, we
            replace it where we can; where we cannot, we refund the unused part
            of the rental.
          </li>
        </ul>

        <h2>10. Our liability</h2>
        <p>
          We are responsible for providing a roadworthy vehicle and the service
          described. We are not liable for indirect loss, including missed
          connections, lost business or consequential expense, except where the
          law does not allow that limitation.
        </p>

        <h2>11. Cancellation</h2>
        <p>
          Cancellation charges are set out in the{" "}
          <Link href="/cancellation-policy" className="text-accent underline underline-offset-2">
            cancellation policy
          </Link>
          .
        </p>

        <h2>12. Ending the rental early</h2>
        <p>
          We may recover the vehicle without notice if these terms are broken,
          if the vehicle is being used unsafely, or if payment due is not made.
          You may end the rental early; charges already incurred remain payable
          and any long-stay discount is recalculated against the period actually
          used.
        </p>

        <h2>13. Governing law</h2>
        <p>
          These terms are governed by the laws of Pakistan, and the courts at{" "}
          {site.contact.city} have jurisdiction.
        </p>

        <h2>14. Changes to these terms</h2>
        <p>
          We may update these terms. The version in force is the one published
          here on the date your rental agreement is signed.
        </p>
      </LegalPage>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms and Conditions", path: "/terms" },
        ])}
      />
    </>
  );
}
