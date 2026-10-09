import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { RentalTerms } from "@/components/vehicle/RentalTerms";
import { getServices, getVehicles } from "@/lib/cms";
import { categoryLabels } from "@/lib/vehicleDisplay";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  if (!service) return {};

  return buildMetadata({
    title: `${service.title} in Pakistan`,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [services, vehicles] = await Promise.all([
    getServices(),
    getVehicles(),
  ]);

  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const relevant = vehicles
    .filter((vehicle) => service.relatedCategories.includes(vehicle.category))
    .slice(0, 3);

  const others = services.filter((item) => item.slug !== service.slug);

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <nav aria-label="Breadcrumb" className="font-ui text-xs text-fg-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/services" className="hover:text-accent">
                Services
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-fg">{service.title}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{service.audience}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl">{service.title}</h1>
            <div className="rule-brand mt-5 h-px w-24" />

            {service.body.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-lg text-fg-muted">
                {paragraph}
              </p>
            ))}

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {service.points.map((point) => (
                <li key={point} className="flex gap-3 text-fg-muted">
                  <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-red" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-card border border-edge bg-panel p-7">
              <h2 className="text-xl">What the rate covers</h2>
              <div className="mt-5">
                <RentalTerms />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-card border border-edge bg-panel p-7 shadow-card">
              <h2 className="text-2xl">Get a price</h2>
              <p className="mt-3 text-fg-muted">
                Tell us the route and the dates and we come back with a figure
                you can act on.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <ButtonLink href="/fare-calculator" size="lg">
                  Estimate a fare
                </ButtonLink>
                <ButtonLink href="/corporate#callback" variant="outline" size="lg">
                  Request a call back
                </ButtonLink>
              </div>
            </div>

            <div className="mt-6 rounded-card border border-edge bg-panel p-7">
              <h2 className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
                Vehicles for this
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.relatedCategories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/fleet/category/${category}`}
                      className="inline-block rounded-pill border border-edge px-3.5 py-1.5 font-ui text-xs text-fg-muted transition-colors hover:border-red hover:text-accent"
                    >
                      {categoryLabels[category]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {relevant.length > 0 ? (
          <section className="mt-16 border-t border-edge pt-12">
            <h2 className="text-3xl">Vehicles we use for this</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relevant.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16 border-t border-edge pt-12">
          <SectionHeading eyebrow="Also from us" title="Other services" />
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {others.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/services/${item.slug}`}
                  className="inline-block rounded-pill border border-edge bg-panel px-4 py-2 font-ui text-sm text-fg-muted transition-colors hover:border-red hover:text-accent"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
    </div>
  );
}
