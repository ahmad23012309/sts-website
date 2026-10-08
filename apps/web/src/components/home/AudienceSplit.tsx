import { Building2, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

const audiences = [
  {
    key: "individual",
    Icon: User,
    title: "For Individuals",
    summary:
      "Daily and weekly rentals on economy cars and sedans, self-drive or with a driver, inside the city or on the motorway.",
    points: [
      "Transparent with-fuel and without-fuel rates",
      "Book online, on WhatsApp or by phone",
      "Fare estimated before you commit",
      "Delivery to your address",
    ],
    href: "/fleet",
    cta: "See available vehicles",
  },
  {
    key: "corporate",
    Icon: Building2,
    title: "For Corporate Clients",
    summary:
      "Long-term contracts with vetted drivers, scheduled maintenance, replacement vehicles and a single monthly invoice.",
    points: [
      "Contract fleets from one vehicle upwards",
      "Vetted and trained drivers",
      "Replacement vehicle guarantee",
      "Monthly invoicing and credit terms",
    ],
    href: "/corporate",
    cta: "Corporate services",
  },
];

export function AudienceSplit() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Who we serve"
          title="Two kinds of client, two ways of working"
          description="The requirements of a weekend rental and a two-year corporate contract have almost nothing in common. Each has its own path through this site."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {audiences.map((audience, index) => (
            <Reveal key={audience.key} delay={index * 80}>
              <article className="group relative h-full overflow-hidden rounded-card border border-edge bg-panel p-8 transition-colors duration-300 hover:border-red/40 sm:p-10">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-red/45 text-accent">
                  <audience.Icon className="h-5 w-5" aria-hidden />
                </span>

                <h3 className="mt-7 text-3xl">{audience.title}</h3>
                <p className="mt-4 text-fg-muted">{audience.summary}</p>

                <ul className="mt-7 space-y-3">
                  {audience.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[0.95rem]">
                      <span
                        aria-hidden
                        className="mt-2.5 h-px w-4 shrink-0 bg-red"
                      />
                      <span className="text-fg-muted">{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={audience.href}
                  className="mt-9 inline-flex items-center font-ui text-sm font-semibold tracking-wide text-accent uppercase underline decoration-red/40 decoration-2 underline-offset-[6px] transition-colors hover:decoration-red"
                >
                  {audience.cta}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
