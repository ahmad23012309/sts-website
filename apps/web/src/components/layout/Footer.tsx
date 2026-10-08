import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { QuickBookingForm } from "@/components/booking/QuickBookingForm";
import { footerNav } from "@/lib/navigation";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Logo />
            <p className="mt-6 max-w-md text-muted">{site.description}</p>

            <ul className="mt-8 space-y-3 font-ui text-sm">
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-3 text-text transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 text-gold" aria-hidden />
                  <span className="tabular">{site.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex items-center gap-3 text-text transition-colors hover:text-gold"
                >
                  <Mail className="h-4 w-4 text-gold" aria-hidden />
                  {site.contact.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  {site.contact.addressLine}, {site.contact.city}
                </span>
              </li>
            </ul>

            <SocialLinks className="mt-8" />
          </div>

          <div className="rounded-card border border-line bg-card p-6 sm:p-8">
            <p className="eyebrow mb-2">Quick booking</p>
            <h2 className="text-3xl">Tell us what you need</h2>
            <p className="mt-3 mb-6 text-muted">
              Four details and we will call you back with availability and a
              price.
            </p>
            <QuickBookingForm />
          </div>
        </div>

        <div className="grid gap-10 border-t border-line py-14 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Fleet" links={footerNav.fleet} />
          <FooterColumn title="Services" links={footerNav.services} />
          <FooterColumn title="Company" links={footerNav.company} />
          <FooterColumn title="Legal" links={footerNav.legal} />
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-7 font-ui text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>
            Rates shown are estimates and are confirmed at the time of booking.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-5 font-ui text-[0.6875rem] font-semibold tracking-[0.18em] text-gold uppercase">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-ui text-sm text-muted transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
