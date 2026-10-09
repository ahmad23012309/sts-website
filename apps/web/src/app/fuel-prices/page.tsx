import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Fuel, Minus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFuelHistory, getFuelRates, getVehicles } from "@/lib/cms";
import { JsonLd, breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { formatPkrPrecise } from "@/lib/utils";
import { fuelLabels, vehicleFullName } from "@/lib/vehicleDisplay";

export const metadata = buildMetadata({
  title: "Petrol and Diesel Prices in Pakistan Today",
  description:
    "Today's petrol, diesel and hi-octane prices in Pakistan, with the date each rate took effect and a record of recent revisions. The rates our with-fuel rental quotes are calculated at.",
  path: "/fuel-prices",
});

const faqs = [
  {
    question: "What is the petrol price in Pakistan today?",
    answer:
      "The current rate is shown at the top of this page along with the date it took effect. We update it whenever a new rate is notified.",
  },
  {
    question: "How often do fuel prices change in Pakistan?",
    answer:
      "Prices are revised regularly, and each revision carries its own effective date. The table on this page records the recent revisions we have on file.",
  },
  {
    question: "How does the fuel price affect my rental?",
    answer:
      "A with-fuel rental includes the fuel for your trip, worked out from the distance, the vehicle's consumption and the fuel price on the day. When the notified price changes, with-fuel quotes change with it. A without-fuel rental is unaffected, because you buy the fuel yourself.",
  },
  {
    question: "Which fuel does my rental vehicle use?",
    answer:
      "Each vehicle page states its fuel type and its consumption in the city and on the highway, so you can see exactly which rate applies and what the fuel will cost per kilometre.",
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function FuelPricesPage() {
  const [rates, history, vehicles] = await Promise.all([
    getFuelRates(),
    getFuelHistory(),
    getVehicles(),
  ]);

  const previous = history[1];
  const petrolChange = previous ? rates.petrol - previous.petrol : 0;

  const headline = [
    { key: "petrol", label: "Petrol", value: rates.petrol, change: petrolChange },
    { key: "diesel", label: "High-speed diesel", value: rates.diesel, change: 0 },
    { key: "hi-octane", label: "Hi-octane", value: rates.hiOctane, change: 0 },
  ];

  // The most economical vehicles make the clearest illustration of what the
  // rate means in practice.
  const economical = [...vehicles]
    .sort((a, b) => b.specs.mileageHighwayKmpl - a.specs.mileageHighwayKmpl)
    .slice(0, 4);

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Fuel prices"
          title="Petrol and diesel prices in Pakistan today"
          description={`Effective from ${formatDate(rates.effectiveFrom)}. These are the rates every with-fuel quote on this site is calculated at, so what you read here is what you are charged.`}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {headline.map((item) => (
            <div
              key={item.key}
              data-surface="dark"
              className="overflow-hidden rounded-card bg-[linear-gradient(135deg,#0c2559_0%,#15192a_65%,#0d0e12_100%)] p-7 text-fg shadow-lift"
            >
              <p className="inline-flex items-center gap-2 font-ui text-[0.625rem] tracking-[0.14em] text-fg-muted uppercase">
                <Fuel className="h-3.5 w-3.5 text-accent" aria-hidden />
                {item.label}
              </p>
              <p className="tabular mt-3 text-4xl font-semibold text-yellow">
                {item.value.toFixed(2)}
                <span className="ml-1.5 font-ui text-xs font-medium tracking-[0.1em] text-fg-faint uppercase">
                  PKR/L
                </span>
              </p>
              {item.change !== 0 ? (
                <p
                  className={`mt-2 inline-flex items-center gap-1 font-ui text-xs ${
                    item.change > 0 ? "text-booked" : "text-available"
                  }`}
                >
                  {item.change > 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(2)} since the previous revision
                </p>
              ) : (
                <p className="mt-2 inline-flex items-center gap-1 font-ui text-xs text-fg-faint">
                  <Minus className="h-3.5 w-3.5" aria-hidden />
                  No previous revision on file
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 font-ui text-xs text-fg-faint">
          {rates.note}
        </p>

        <section className="mt-16">
          <h2 className="text-3xl">Recent revisions</h2>
          <p className="mt-3 max-w-2xl text-fg-muted">
            Each row is a published rate and the date it took effect. A dash
            means we do not hold that figure for that date rather than that it
            did not change.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-edge-strong">
                  <th scope="col" className="py-3 pr-4 font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                    Effective from
                  </th>
                  <th scope="col" className="py-3 pr-4 text-right font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                    Petrol
                  </th>
                  <th scope="col" className="py-3 pr-4 text-right font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                    Diesel
                  </th>
                  <th scope="col" className="py-3 text-right font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                    Hi-octane
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr
                    key={record.effectiveFrom}
                    className={`border-b border-edge ${index === 0 ? "bg-page-alt" : ""}`}
                  >
                    <th scope="row" className="py-3 pr-4 font-ui text-sm font-normal text-fg">
                      {formatDate(record.effectiveFrom)}
                      {index === 0 ? (
                        <span className="ml-2 rounded-pill bg-red px-2 py-0.5 font-ui text-[0.625rem] font-semibold tracking-wide text-white uppercase">
                          Current
                        </span>
                      ) : null}
                    </th>
                    <td className="tabular py-3 pr-4 text-right text-sm font-semibold text-fg">
                      {record.petrol.toFixed(2)}
                    </td>
                    <td className="tabular py-3 pr-4 text-right text-sm text-fg-muted">
                      {record.diesel === null ? "—" : record.diesel.toFixed(2)}
                    </td>
                    <td className="tabular py-3 text-right text-sm text-fg-muted">
                      {record.hiOctane === null ? "—" : record.hiOctane.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 border-t border-edge pt-12">
          <h2 className="text-3xl">What this means for your rental</h2>
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-fg-muted">
                A with-fuel rental includes the fuel for your trip. We work it
                out from the distance, the vehicle&rsquo;s own consumption and
                the rate above, then show you the arithmetic. When the notified
                price moves, with-fuel quotes move with it, which is why every
                estimate on this site carries the rate and date it was built on.
              </p>
              <p className="mt-4 text-fg-muted">
                A without-fuel rental is not affected. You take the vehicle,
                fill it yourself, and the daily rate is all you pay for it.
              </p>
              <p className="mt-6">
                <Link
                  href="/fare-calculator"
                  className="font-ui text-sm font-semibold text-accent uppercase underline decoration-red/40 decoration-2 underline-offset-[6px] hover:decoration-red"
                >
                  Work out a fare at today&rsquo;s rate
                </Link>
              </p>
            </div>

            <div>
              <h3 className="text-xl">Fuel cost per kilometre, today</h3>
              <p className="mt-2 font-ui text-sm text-fg-muted">
                Highway consumption, at the rates above.
              </p>
              <ul className="mt-5 divide-y divide-edge border-y border-edge">
                {economical.map((vehicle) => {
                  const price =
                    vehicle.specs.fuelType === "diesel"
                      ? rates.diesel
                      : rates.petrol;
                  const perKm = price / vehicle.specs.mileageHighwayKmpl;
                  return (
                    <li
                      key={vehicle.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/fleet/${vehicle.slug}`}
                          className="block truncate font-ui text-sm font-medium text-fg hover:text-accent"
                        >
                          {vehicleFullName(vehicle)}
                        </Link>
                        <span className="font-ui text-xs text-fg-faint">
                          {fuelLabels[vehicle.specs.fuelType]} &middot;{" "}
                          {vehicle.specs.mileageHighwayKmpl} km/l
                        </span>
                      </div>
                      <span className="tabular shrink-0 text-sm font-semibold text-price">
                        {formatPkrPrecise(perKm)}
                        <span className="ml-1 font-ui text-[0.625rem] font-medium text-fg-faint">
                          /km
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-edge pt-12">
          <h2 className="text-3xl">Questions about fuel prices</h2>
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
      </Container>

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fuel Prices", path: "/fuel-prices" },
        ])}
      />
    </div>
  );
}
