import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "What we collect when you book or enquire, why we hold it, who it is shared with, how long we keep it and how to ask us to delete it.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalPage
        eyebrow="Legal"
        title="Privacy Policy"
        intro="What this website collects, why, and what we do with it. Written to describe what actually happens rather than to cover every eventuality."
      >
        <h2>1. Who is responsible</h2>
        <p>
          {site.name}, {site.contact.addressLine}, {site.contact.city},
          Pakistan, decides how the information described here is used. For
          anything in this policy, contact{" "}
          <a href={`mailto:${site.contact.email}`} className="text-accent underline underline-offset-2">
            {site.contact.email}
          </a>{" "}
          or call {site.contact.phone}.
        </p>

        <h2>2. The legal position in Pakistan</h2>
        <p>
          Pakistan has no comprehensive data protection statute in force. A
          Personal Data Protection Bill has been drafted but has not been
          enacted. Privacy is a fundamental right under Article 14 of the
          Constitution, and the Prevention of Electronic Crimes Act 2016, as
          amended, applies to electronic data and unauthorised access.
        </p>
        <p>
          Rather than claim compliance with a law that does not yet exist, we
          work to the principles the draft bill sets out: collect only what is
          needed, use it only for the purpose it was given, keep it no longer
          than necessary, and let you see, correct or delete it.
        </p>

        <h2>3. What we collect</h2>
        <h3>When you send a booking or enquiry</h3>
        <ul>
          <li>Your name, phone number and, if you give one, email address.</li>
          <li>
            The vehicle, dates, city, pick-up and drop-off points, fuel and
            driver options, and any notes you add.
          </li>
          <li>
            For corporate enquiries: company name, your designation, the number
            of vehicles and the contract length.
          </li>
        </ul>

        <h3>When you rent a vehicle</h3>
        <ul>
          <li>
            Copies of the documents listed in our terms: CNIC or passport, and
            driving licence for each named driver.
          </li>
          <li>The rental agreement, payment record and vehicle condition record.</li>
        </ul>

        <h3>Automatically</h3>
        <p>
          Our hosting keeps standard server logs, including IP address and
          request time, which we use to keep the site available and to stop
          abuse of the booking forms. We apply a rate limit per IP address for
          the same reason.
        </p>

        <h2>4. What we do not do</h2>
        <ul>
          <li>We do not sell or rent your information to anyone.</li>
          <li>We do not use it for advertising profiles.</li>
          <li>
            We do not run advertising or tracking cookies on this site. If that
            changes, this page changes first and you will be asked.
          </li>
        </ul>

        <h2>5. Storage in your browser</h2>
        <p>
          The site stores a small amount of information in your own browser, not
          on our servers: whether you have already been shown our offer, so you
          are not shown it again. It never leaves your device and you can clear
          it at any time through your browser settings.
        </p>

        <h2>6. Who else sees it</h2>
        <ul>
          <li>
            <strong>Our own systems.</strong> Bookings and enquiries are passed
            to our internal booking system over an encrypted, signed connection.
          </li>
          <li>
            <strong>Our hosting provider</strong>, which runs the website on our
            behalf.
          </li>
          <li>
            <strong>WhatsApp</strong>, if you choose to message us there. That
            conversation is governed by WhatsApp&rsquo;s own privacy terms, not
            ours.
          </li>
          <li>
            <strong>Authorities</strong>, where the law requires it, for example
            in connection with an accident or an offence involving one of our
            vehicles.
          </li>
        </ul>

        <h2>7. How long we keep it</h2>
        <ul>
          <li>
            Enquiries that do not become bookings: up to twelve months, then
            deleted.
          </li>
          <li>
            Completed rentals: kept for the period our tax and accounting
            obligations require.
          </li>
          <li>Document copies: kept with the rental file for the same period.</li>
        </ul>

        <h2>8. Your choices</h2>
        <p>You can ask us to:</p>
        <ul>
          <li>tell you what we hold about you;</li>
          <li>correct anything that is wrong;</li>
          <li>
            delete what we hold, where we are not required to keep it for tax or
            legal reasons;
          </li>
          <li>stop contacting you.</li>
        </ul>
        <p>
          Email{" "}
          <a href={`mailto:${site.contact.email}`} className="text-accent underline underline-offset-2">
            {site.contact.email}
          </a>{" "}
          and we will respond within thirty days.
        </p>

        <h2>9. Security</h2>
        <p>
          The site is served over HTTPS. Form submissions are validated on our
          servers and signed in transit to our booking system. Access to booking
          records is limited to staff who need it. No system is perfect, and we
          will tell affected customers promptly if something goes wrong.
        </p>

        <h2>10. Children</h2>
        <p>
          This site is not aimed at children, and we do not knowingly collect
          their information. Our vehicles are rented only to adults who meet the
          requirements in our terms.
        </p>

        <h2>11. Changes</h2>
        <p>
          When this policy changes, the date at the top changes with it.
        </p>
      </LegalPage>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
    </>
  );
}
