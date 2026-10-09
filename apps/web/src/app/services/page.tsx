import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices } from "@/lib/cms";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Services | Staff Transport, Fleet Hire and Travel",
  description:
    "Staff transport, corporate fleet leasing, daily rental, airport transfers, intercity travel and event transport across Pakistan.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Services"
          title="What we do"
          description="Six ways we work, from a single car for a day to a fleet of coasters running a staff route every morning."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group flex h-full flex-col rounded-card border border-edge bg-panel p-7 transition-colors duration-300 hover:border-red/40"
            >
              <p className="font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-accent uppercase">
                {service.audience}
              </p>
              <h2 className="mt-4 text-2xl transition-colors group-hover:text-accent">
                {service.title}
              </h2>
              <p className="mt-3 flex-1 text-[0.95rem] text-fg-muted">
                {service.summary}
              </p>
              <span className="mt-6 font-ui text-sm font-semibold text-accent uppercase underline decoration-red/40 decoration-2 underline-offset-[6px] group-hover:decoration-red">
                Read more
              </span>
            </Link>
          ))}
        </div>
      </Container>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
    </div>
  );
}
