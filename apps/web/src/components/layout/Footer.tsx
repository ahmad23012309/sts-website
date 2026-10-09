import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { LocationMap } from "@/components/layout/LocationMap";
import { footerNav } from "@/lib/navigation";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-surface="dark" className="border-t border-edge bg-page text-fg">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Logo />
            <p className="mt-6 max-w-md text-fg-muted">{site.description}</p>

            <ul className="mt-8 space-y-3 font-ui text-sm">
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-3 text-fg transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 text-accent" aria-hidden />
                  <span className="tabular">{site.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex items-center gap-3 text-fg transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 text-accent" aria-hidden />
                  {site.contact.email}
                </a>
              </li>

            </ul>

            <SocialLinks className="mt-8" />
          </div>

          <div>
            <p className="eyebrow mb-2">Find us</p>
            <h2 className="text-3xl">Where we are</h2>
            <p className="mt-3 mb-6 text-fg-muted">
              Collection from our yard, or we deliver the vehicle to you.
            </p>
            <LocationMap />
          </div>
        </div>

        <div className="border-t border-edge py-10">
          <h2 className="font-ui text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">
            Cities we serve
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {footerNav.cities.map((city) => (
              <li key={city.href}>
                <Link
                  href={city.href}
                  className="inline-block rounded-pill border border-edge px-3.5 py-1.5 font-ui text-xs text-fg-muted transition-colors hover:border-red hover:text-accent"
                >
                  {city.label}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-ui text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">
            Collection and delivery in Lahore
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
            {site.serviceAreas.map((area) => (
              <li
                key={area}
                className="rounded-pill border border-edge px-3.5 py-1.5 font-ui text-xs text-fg-muted"
              >
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-ui text-xs text-fg-faint">
            Travelling further? We run intercity journeys and one-way drops
            nationwide.
          </p>
        </div>

        <div className="grid gap-10 border-t border-edge py-14 sm:grid-cols-2 lg:grid-cols-5">
          <FooterColumn title="Fleet" links={footerNav.fleet} />
          <FooterColumn title="Services" links={footerNav.services} />
          <FooterColumn title="Company" links={footerNav.company} />
          <FooterColumn title="Tools" links={footerNav.tools} />
          <FooterColumn title="Legal" links={footerNav.legal} />
        </div>

        <div className="flex flex-col gap-3 border-t border-edge py-7 font-ui text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
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
      <h3 className="mb-5 font-ui text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-ui text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
