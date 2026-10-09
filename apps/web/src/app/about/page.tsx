import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { getVehicles } from "@/lib/cms";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Sidhu Travel Services",
  description:
    "A Pakistani transport company running coasters, vans, buses, cars and SUVs for corporate staff transport and everyday hire, with pricing you can check.",
  path: "/about",
});

export default async function AboutPage() {
  const vehicles = await getVehicles();
  const total = vehicles.reduce((sum, v) => sum + v.unitsInFleet, 0);
  const group = vehicles
    .filter((v) => ["coaster", "van", "bus"].includes(v.category))
    .reduce((sum, v) => sum + v.unitsInFleet, 0);

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="About us"
          title="A transport company, not a listings site"
          description={`We own and run ${total} vehicles across ${vehicles.length} models. Every one of them is ours, maintained by us and driven by people we employ.`}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="space-y-5 text-lg text-fg-muted">
            <p>
              {site.claims.yearsInService} years in, the shape of the business
              is clear from the fleet itself: {group} of our {total} vehicles
              are coasters, vans and intercity coaches. Moving people to work,
              to sites and to events is the larger half of what we do, and
              almost everything we have learned comes from the mornings that
              had to go right.
            </p>
            <p>
              The other half is ordinary hire. Cars and SUVs by the day or the
              week, self-drive or with a driver, for people who need a vehicle
              and would rather not negotiate for it.
            </p>
            <p>
              The two jobs look different but they fail the same way: a vehicle
              that was not serviced, a driver nobody briefed, a price that
              changed at handover. We have built the business around removing
              those three, and this website around proving it before you call.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-card border border-edge bg-panel p-7">
              <h2 className="text-xl">The fleet in numbers</h2>
              <dl className="mt-5 space-y-3">
                {[
                  ["Vehicles on the road", String(total)],
                  ["Models", String(vehicles.length)],
                  ["For group and staff transport", String(group)],
                  ["Years in service", site.claims.yearsInService],
                  ["Clients served", site.claims.clientsServed],
                  ["On-time record", site.claims.onTimeRate],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4 border-b border-edge pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="font-ui text-sm text-fg-muted">{label}</dt>
                    <dd className="tabular text-lg font-semibold text-price">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <section className="mt-18 border-t border-edge pt-12 lg:mt-24">
          <SectionHeading
            eyebrow="How we work"
            title="Three things we will not move on"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "The price is the price",
                body: "Every rate is published. Every quote is itemised: vehicle, fuel, driver, tolls. The with-fuel figure moves with the notified fuel price and we show you which rate it was built on, so nothing changes at handover that you did not already see.",
              },
              {
                title: "The vehicle is ours",
                body: "We do not broker other people's cars. Servicing is planned against each registration, the record follows the vehicle, and if one is off the road another covers the job.",
              },
              {
                title: "The driver is ours too",
                body: "Documented, trained and assigned. On a staff route the same driver runs it, because the people being collected should know who is collecting them.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-card border border-edge bg-panel p-7"
              >
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-18 border-t border-edge pt-12 lg:mt-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl">Where we operate</h2>
              <p className="mt-4 text-fg-muted">
                We collect from and deliver across Lahore, and run intercity
                journeys and one-way drops nationwide.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
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
            <div className="rounded-card border border-edge bg-panel p-8">
              <h2 className="text-2xl">Talk to us</h2>
              <p className="mt-3 text-fg-muted">
                Whether it is one car for a weekend or twelve coasters every
                morning, the first conversation is the same: tell us what has to
                happen and when.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <ButtonLink href="/contact" size="lg">
                  Contact us
                </ButtonLink>
                <ButtonLink href="/corporate" variant="outline" size="lg">
                  Corporate services
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-14 font-ui text-xs text-fg-faint">
          Company registration details and our full terms are on the{" "}
          <Link href="/faq" className="underline underline-offset-2 hover:text-fg-muted">
            questions page
          </Link>
          .
        </p>
      </Container>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </div>
  );
}
