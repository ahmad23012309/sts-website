import Image from "next/image";
import Link from "next/link";
import { Building2, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getVehicles } from "@/lib/cms";

const audiences = [
  {
    key: "individual",
    Icon: User,
    title: "For Individuals",
    summary:
      "Cars, SUVs and vans by the day or the week, self-drive or with a driver, inside the city or on the motorway.",
    points: [
      "Transparent with-fuel and without-fuel rates",
      "Book online, on WhatsApp or by phone",
      "Fare estimated before you commit",
      "Delivery to your address",
    ],
    href: "/fleet",
    cta: "See available vehicles",
    /** The vehicle this kind of client actually ends up in. */
    vehicle: "toyota-corolla-altis",
  },
  {
    key: "corporate",
    Icon: Building2,
    title: "For Corporate Clients",
    summary:
      "Staff transport and contract fleets: coasters, vans and buses with vetted drivers, scheduled maintenance, replacement vehicles and a single monthly invoice.",
    points: [
      "Daily staff pick and drop on fixed routes",
      "Coasters, Hiace vans and intercity coaches",
      "Vetted and trained drivers",
      "Replacement vehicle guarantee and monthly invoicing",
    ],
    href: "/corporate",
    cta: "Corporate services",
    vehicle: "toyota-hiace",
  },
];

export async function AudienceSplit() {
  const vehicles = await getVehicles();
  const shotFor = (slug: string) =>
    vehicles.find((vehicle) => vehicle.slug === slug)?.images[0] ?? null;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Who we serve"
          title="Two kinds of client, two ways of working"
          description="The requirements of a weekend rental and a two-year corporate contract have almost nothing in common. Each has its own path through this site."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {audiences.map((audience, index) => {
            const shot = shotFor(audience.vehicle);

            return (
              <Reveal key={audience.key} delay={index * 80}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-edge bg-panel transition-colors duration-300 hover:border-red/40">
                  <div className="relative grid aspect-[2/1] place-items-center overflow-hidden bg-[linear-gradient(170deg,#ffffff_0%,#eef1f6_100%)] px-8 pt-6 pb-4">
                    <span
                      aria-hidden
                      className="absolute inset-x-16 bottom-6 h-7 rounded-[50%] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(13,14,18,0.15),transparent_72%)]"
                    />
                    {shot ? (
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        sizes="(min-width: 1024px) 46vw, 92vw"
                        className="relative h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-8 sm:p-10">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-red/45 text-accent">
                      <audience.Icon className="h-5 w-5" aria-hidden />
                    </span>

                    <h3 className="mt-7 text-3xl">{audience.title}</h3>
                    <p className="mt-4 text-fg-muted">{audience.summary}</p>

                    <ul className="mt-7 flex-1 space-y-3">
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
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
