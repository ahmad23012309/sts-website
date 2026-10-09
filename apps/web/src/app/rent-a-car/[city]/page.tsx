import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { RentalTerms } from "@/components/vehicle/RentalTerms";
import {
  getCities,
  getCity,
  getFuelRates,
  getRoutes,
  getVehicles,
} from "@/lib/cms";
import { site } from "@/lib/site";
import { formatPkr, formatPkrPrecise } from "@/lib/utils";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
} from "@/lib/seo";

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = await getCity(slug);
  if (!city) return {};

  return buildMetadata({
    title: `Rent a Car in ${city.name} | Daily Rates, With or Without a Driver`,
    description: `Car, van, coaster and bus hire in ${city.name}. Published daily rates with and without fuel, vetted drivers, and delivery to your address.`,
    path: `/rent-a-car/${city.slug}`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const [city, cities, vehicles, routes, fuelRates] = await Promise.all([
    getCity(slug),
    getCities(),
    getVehicles(),
    getRoutes(),
    getFuelRates(),
  ]);

  if (!city) notFound();

  const cityRoutes = routes.filter(
    (route) => route.origin === city.name || route.destination === city.name,
  );

  const cheapest = [...vehicles].sort(
    (a, b) => a.rates.withFuelDaily - b.rates.withFuelDaily,
  );
  const featured = [
    cheapest[0],
    vehicles.find((v) => v.category === "sedan"),
    vehicles.find((v) => v.category === "coaster"),
  ].filter((v): v is NonNullable<typeof v> => Boolean(v));

  const others = cities.filter((item) => item.slug !== city.slug);

  const faqs = [
    {
      question: `How much does it cost to rent a car in ${city.name}?`,
      answer: `Rates start at ${formatPkr(cheapest[0]?.rates.withFuelDaily ?? 0)} per day with fuel for a small car and run up to our coasters and intercity coaches. Every vehicle's rate, with and without fuel, is published on its own page.`,
    },
    {
      question: `Do you deliver the vehicle in ${city.name}?`,
      answer: city.isBase
        ? `Yes. We collect from and deliver across ${city.name}, including ${city.areas.slice(0, 4).join(", ")} and the airport.`
        : `Yes, by arrangement. Tell us the date and the address when you book and we position the vehicle for it.`,
    },
    {
      question: "Can I rent without a driver?",
      answer:
        "Self-drive is available on most of the fleet against a valid licence, CNIC and a refundable deposit. Some larger and premium vehicles are chauffeur-driven only.",
    },
    {
      question: "Does the price change with the fuel price?",
      answer: `The with-fuel rate does, because it is calculated at the notified price on the day, currently ${formatPkrPrecise(fuelRates.petrol)} per litre for petrol. The without-fuel rate does not.`,
    },
  ];

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
            <li className="text-fg">Rent a car in {city.name}</li>
          </ol>
        </nav>

        <div className="mt-6">
          <SectionHeading
            as="h1"
            eyebrow={city.isBase ? "Our home city" : "Served from Lahore"}
            title={`Rent a car in ${city.name}`}
            description={city.intro}
          />
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/book" size="lg">
            Book a vehicle
          </ButtonLink>
          <ButtonLink href="/fare-calculator" variant="outline" size="lg">
            Estimate a fare
          </ButtonLink>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl">What people hire for in {city.name}</h2>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {city.uses.map((use) => (
              <li key={use} className="flex gap-3 text-fg-muted">
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-red" />
                {use}
              </li>
            ))}
          </ul>
        </section>

        {city.areas.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-3xl">Collection and delivery</h2>
            <p className="mt-4 max-w-2xl text-fg-muted">
              We bring the vehicle to you anywhere in {city.name}, including:
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {city.areas.map((area) => (
                <li
                  key={area}
                  className="rounded-pill border border-edge bg-panel px-3.5 py-1.5 font-ui text-xs text-fg-muted"
                >
                  {area}
                </li>
              ))}
              {city.airport ? (
                <li className="rounded-pill border border-red/45 bg-red/5 px-3.5 py-1.5 font-ui text-xs text-accent">
                  {city.airport}
                </li>
              ) : null}
            </ul>
          </section>
        ) : city.airport ? (
          <section className="mt-16">
            <h2 className="text-3xl">Collection and delivery</h2>
            <p className="mt-4 max-w-2xl text-fg-muted">
              Collection in {city.name} is arranged in advance, including at{" "}
              {city.airport}. Give us the address and the time when you book.
            </p>
          </section>
        ) : null}

        {cityRoutes.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-3xl">Routes from {city.name}</h2>
            <p className="mt-4 max-w-2xl text-fg-muted">
              Distances we hold on file. Fares are calculated from these, the
              vehicle&rsquo;s consumption and the fuel price on the day.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-edge-strong">
                    <th scope="col" className="py-3 pr-4 font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                      Route
                    </th>
                    <th scope="col" className="py-3 pr-4 text-right font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                      Distance
                    </th>
                    <th scope="col" className="py-3 text-right font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                      Typical time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cityRoutes.map((route) => (
                    <tr
                      key={`${route.origin}-${route.destination}`}
                      className="border-b border-edge"
                    >
                      <th scope="row" className="py-3 pr-4 font-ui text-sm font-normal text-fg">
                        {route.origin} to {route.destination}
                      </th>
                      <td className="tabular py-3 pr-4 text-right text-sm text-fg-muted">
                        {route.distanceKm} km
                      </td>
                      <td className="tabular py-3 text-right text-sm text-fg-muted">
                        {route.estimatedHours} hrs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="mt-16">
          <h2 className="text-3xl">Popular vehicles</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          <p className="mt-6">
            <Link
              href="/fleet"
              className="font-ui text-sm font-semibold text-accent uppercase underline decoration-red/40 decoration-2 underline-offset-[6px] hover:decoration-red"
            >
              See the whole fleet
            </Link>
          </p>
        </section>

        <section className="mt-16 rounded-card border border-edge bg-panel p-8">
          <h2 className="text-2xl">What the rate covers</h2>
          <div className="mt-6">
            <RentalTerms />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Questions about hiring in {city.name}</h2>
          <div className="mt-6 max-w-3xl divide-y divide-edge border-y border-edge">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-ui text-base font-medium text-fg marker:content-none">
                  {faq.question}
                  <span
                    aria-hidden
                    className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-edge text-accent transition-colors group-open:border-red"
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current transition-transform duration-200 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="mt-3 text-fg-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-edge pt-10">
          <h2 className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
            Other cities
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/rent-a-car/${item.slug}`}
                  className="inline-block rounded-pill border border-edge bg-panel px-4 py-2 font-ui text-sm text-fg-muted transition-colors hover:border-red hover:text-accent"
                >
                  Rent a car in {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `Rent a car in ${city.name}`, path: `/rent-a-car/${city.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Car rental",
          provider: { "@id": `${site.url}#organization` },
          areaServed: { "@type": "City", name: city.name },
          url: `${site.url}/rent-a-car/${city.slug}`,
        }}
      />
    </div>
  );
}
