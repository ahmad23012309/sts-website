import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { getFuelRates, getPricingRules, getVehicles, getRoutes } from "@/lib/cms";
import { calculateFare } from "@/lib/pricing/calculateFare";
import { formatPkr } from "@/lib/utils";

/**
 * Shows a real worked example produced by the same function the calculator
 * uses, so the homepage cannot drift away from the live pricing logic.
 */
export async function FareTeaser() {
  const [vehicles, routes, fuelRates, rules] = await Promise.all([
    getVehicles(),
    getRoutes(),
    getFuelRates(),
    getPricingRules(),
  ]);

  const vehicle = vehicles.find((item) => item.slug === "toyota-corolla-altis-grande");
  const route = routes.find(
    (item) => item.origin === "Lahore" && item.destination === "Islamabad",
  );

  if (!vehicle || !route) return null;

  const fare = calculateFare({
    vehicle,
    tripType: "out-of-station",
    distanceKm: route.distanceKm,
    days: 2,
    withFuel: true,
    fuelRates,
    rules,
    tollCharges: route.tollCharges,
  });

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Live fare calculator"
              title="No guessing, no haggling"
              description="Pick a route, a vehicle and the dates. The estimate is built from the distance, the vehicle's consumption and the fuel price in force today, and it is shown as a breakdown rather than a single number."
            />
            <ul className="mt-9 space-y-3 text-muted">
              <li>Distances taken from our own route table, not a guess.</li>
              <li>With-fuel and without-fuel compared side by side.</li>
              <li>The quote converts straight into a booking or a WhatsApp message.</li>
            </ul>
            <ButtonLink href="/fare-calculator" size="lg" className="mt-10">
              Open the calculator
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>

          <div className="rounded-card border border-line bg-card p-7 shadow-card sm:p-9">
            <p className="eyebrow">Worked example</p>
            <h3 className="mt-3 text-2xl">
              {route.origin} to {route.destination}
            </h3>
            <p className="mt-1.5 font-ui text-xs text-muted">
              {vehicle.make} {vehicle.model} {vehicle.variant} &middot; 2 days
              &middot; with fuel &middot; {route.distanceKm} km each way
            </p>

            <dl className="mt-7 space-y-3.5 border-t border-line pt-7">
              {fare.lines.map((line) => (
                <div key={line.label} className="flex items-baseline justify-between gap-6">
                  <dt>
                    <span className="font-ui text-sm text-text">{line.label}</span>
                    <span className="mt-0.5 block font-ui text-[0.6875rem] text-faint">
                      {line.detail}
                    </span>
                  </dt>
                  <dd className="tabular shrink-0 text-sm text-muted">
                    {formatPkr(line.amount)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex items-baseline justify-between gap-6 border-t border-line pt-6">
              <span className="font-ui text-xs tracking-[0.14em] text-muted uppercase">
                Estimated total
              </span>
              <span className="tabular text-3xl font-semibold text-yellow">
                {formatPkr(fare.total)}
              </span>
            </div>

            <p className="mt-5 font-ui text-[0.6875rem] leading-relaxed text-faint">
              Includes a {rules.marginPercent}% service charge. Calculated at
              PKR {fare.fuelRatePerLitre.toFixed(2)} per litre, effective{" "}
              {fare.fuelRateEffectiveFrom}. Confirmed at the time of booking.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
