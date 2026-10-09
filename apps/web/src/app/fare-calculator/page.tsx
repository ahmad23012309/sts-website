import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FareCalculator } from "@/components/fare/FareCalculator";
import {
  getFuelRates,
  getPricingRules,
  getRoutes,
  getVehicles,
} from "@/lib/cms";
import { JsonLd, breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { formatPkrPrecise } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Rent a Car Fare Calculator | Estimate Your Trip Cost",
  description:
    "Work out what a trip will cost before you book. Choose the route, the vehicle and the dates, and see the fare broken down line by line at today's fuel price.",
  path: "/fare-calculator",
});

const faqs = [
  {
    question: "How is the fare calculated?",
    answer:
      "The vehicle's daily rate for the trip type, plus fuel for the distance at the vehicle's own consumption figure and the day's notified fuel price, plus the driver allowance and night stay where the trip is out of station, plus tolls. A service charge is added on top and the total is rounded up.",
  },
  {
    question: "Why does the same trip cost a different amount next week?",
    answer:
      "Fuel prices in Pakistan are revised regularly and the with-fuel rate follows them. Every estimate shows the rate it was calculated at and the date that rate took effect.",
  },
  {
    question: "Is fuel charged for the return journey on a one-way trip?",
    answer:
      "The vehicle still has to come back, so the return leg is included unless agreed otherwise. The breakdown shows the billable distance so you can see exactly what has been charged.",
  },
  {
    question: "Is the estimate the final price?",
    answer:
      "No. It is an estimate built from published rates. We confirm availability and the final price before anything is booked, and nothing is charged at this stage.",
  },
];

export default async function FareCalculatorPage() {
  const [vehicles, routes, fuelRates, rules] = await Promise.all([
    getVehicles(),
    getRoutes(),
    getFuelRates(),
    getPricingRules(),
  ]);

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Live fare calculator"
          title="What will this trip cost?"
          description="Pick the route, the vehicle and the dates. The estimate is built from the distance, the vehicle's own consumption and the fuel price in force today, and it is shown line by line rather than as a single number."
        />

        <div className="mt-12">
          <Suspense
            fallback={
              <p className="font-ui text-sm text-fg-muted">
                Loading the calculator…
              </p>
            }
          >
            <FareCalculator
              vehicles={vehicles}
              routes={routes}
              fuelRates={fuelRates}
              rules={rules}
            />
          </Suspense>
        </div>

        <section className="mt-20 border-t border-edge pt-12">
          <h2 className="text-3xl">How the number is reached</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-fg-muted">
                Four things decide the price: how long you keep the vehicle, how
                far it travels, how much fuel that distance needs, and whether a
                driver stays with it. Nothing else is hidden in the figure.
              </p>
              <ol className="mt-6 space-y-3 text-fg-muted">
                <li>
                  <span className="font-ui text-sm font-semibold text-fg">
                    Vehicle
                  </span>{" "}
                  — the daily rate for the trip type, multiplied by the days.
                </li>
                <li>
                  <span className="font-ui text-sm font-semibold text-fg">
                    Fuel
                  </span>{" "}
                  — the billable distance divided by the vehicle&rsquo;s
                  consumption, at{" "}
                  {formatPkrPrecise(fuelRates.petrol)} per litre for petrol and{" "}
                  {formatPkrPrecise(fuelRates.diesel)} for diesel, the rates in
                  force from {fuelRates.effectiveFrom}.
                </li>
                <li>
                  <span className="font-ui text-sm font-semibold text-fg">
                    Driver
                  </span>{" "}
                  — the allowance per day, plus a night stay for each night away.
                </li>
                <li>
                  <span className="font-ui text-sm font-semibold text-fg">
                    Tolls
                  </span>{" "}
                  — motorway charges on the routes we have on file.
                </li>
              </ol>
              <p className="mt-6 text-fg-muted">
                Current fuel prices and how they have moved are on the{" "}
                <Link
                  href="/fuel-prices"
                  className="text-accent underline decoration-red/40 decoration-2 underline-offset-[5px] hover:decoration-red"
                >
                  fuel prices page
                </Link>
                .
              </p>
            </div>

            <div>
              <h3 className="text-2xl">Common questions</h3>
              <div className="mt-4 divide-y divide-edge border-y border-edge">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-ui text-sm font-medium text-fg marker:content-none">
                      {faq.question}
                      <span
                        aria-hidden
                        className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full border border-edge text-accent transition-colors group-open:border-red"
                      >
                        <span className="absolute h-px w-2.5 bg-current" />
                        <span className="absolute h-2.5 w-px bg-current transition-transform duration-200 group-open:scale-y-0" />
                      </span>
                    </summary>
                    <p className="mt-3 text-fg-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Container>

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fare Calculator", path: "/fare-calculator" },
        ])}
      />
    </div>
  );
}
