import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuickBookingForm } from "@/components/booking/QuickBookingForm";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  organizationJsonLd,
} from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Sidhu Travel Services",
  description:
    "Call, message on WhatsApp or email us. Vehicle hire, staff transport and corporate fleet enquiries across Lahore and nationwide.",
  path: "/contact",
});

export default function ContactPage() {
  const tel = `tel:${site.contact.phone.replace(/\s/g, "")}`;

  const channels = [
    {
      Icon: Phone,
      label: "Phone",
      value: site.contact.phone,
      href: tel,
      note: "Fastest for anything urgent",
    },
    {
      Icon: WhatsappIcon,
      label: "WhatsApp",
      value: site.contact.whatsapp,
      href: whatsappLink(
        site.contact.whatsapp,
        `Hello ${site.name}, I would like to enquire about a vehicle.`,
      ),
      note: "Send your dates and we reply with a price",
      external: true,
    },
    {
      Icon: Mail,
      label: "Email",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
      note: "General enquiries and bookings",
    },
    {
      Icon: Mail,
      label: "Corporate email",
      value: site.contact.emailCorporate,
      href: `mailto:${site.contact.emailCorporate}`,
      note: "Contracts, staff routes and invoicing",
    },
  ];

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Tell us what you need"
          description="Four details and we call you back with availability and a price. If it is urgent, phone or WhatsApp is faster than any form."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <ul className="divide-y divide-edge border-y border-edge">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-4 py-5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-red/45 text-accent">
                      <channel.Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
                        {channel.label}
                      </span>
                      <span className="tabular mt-1 block text-lg font-medium text-fg transition-colors group-hover:text-accent">
                        {channel.value}
                      </span>
                      <span className="mt-0.5 block font-ui text-xs text-fg-faint">
                        {channel.note}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-4">
              <p className="flex items-start gap-3 text-fg-muted">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>
                  {site.contact.addressLine}
                  <br />
                  {site.contact.city}, {site.contact.country}
                </span>
              </p>
              <p className="flex items-start gap-3 text-fg-muted">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {site.contact.hours}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
                Collection and delivery in Lahore
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {site.serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-pill border border-edge bg-panel px-3.5 py-1.5 font-ui text-xs text-fg-muted"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-card border border-edge bg-panel p-7 shadow-card sm:p-8">
            <h2 className="text-2xl">Request a call back</h2>
            <p className="mt-2.5 mb-6 text-fg-muted">
              For contract and staff transport enquiries, the{" "}
              <a
                href="/corporate#callback"
                className="text-accent underline decoration-red/40 decoration-2 underline-offset-[5px] hover:decoration-red"
              >
                fleet desk form
              </a>{" "}
              collects what we need in one go.
            </p>
            <QuickBookingForm />
          </div>
        </div>
      </Container>

      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </div>
  );
}
