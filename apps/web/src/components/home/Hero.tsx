import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { getVehicles } from "@/lib/cms";
import { HeroQuoteCard } from "@/components/home/HeroQuoteCard";
import { formatPkr } from "@/lib/utils";

/**
 * The opening screen.
 *
 * The coaster carries it rather than a stock photograph of a motorway, because
 * the coaster is what most of this business actually is: 22 of the 81 vehicles
 * on the register, moving staff for companies every morning. The quote card
 * overlaps it so the first thing in reach is the one action that matters, and
 * the price under the card is read from the fleet, not typed, so it cannot
 * drift away from what the vehicle really costs.
 */
export async function Hero() {
  const vehicles = await getVehicles();

  // Taken from the fleet register rather than written by hand, so the figures
  // on the homepage cannot drift away from what is actually on the road.
  const totalVehicles = vehicles.reduce(
    (sum, vehicle) => sum + vehicle.unitsInFleet,
    0,
  );
  const groupTransport = vehicles
    .filter((vehicle) => ["coaster", "bus", "van"].includes(vehicle.category))
    .reduce((sum, vehicle) => sum + vehicle.unitsInFleet, 0);

  const hero = vehicles.find((vehicle) => vehicle.slug === "toyota-coaster");
  const shot = hero?.images[0];

  const stats = [
    { value: String(totalVehicles), label: "Vehicles on the road" },
    { value: String(groupTransport), label: "For group and staff transport" },
    { value: "24/7", label: "Support and dispatch" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_82%_-10%,rgba(18,55,133,0.10),transparent_60%),radial-gradient(50%_45%_at_2%_0%,rgba(206,29,23,0.07),transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px rule-brand opacity-50"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 pt-16 pb-4 lg:grid-cols-[1.15fr_1fr] lg:pt-24 lg:pb-6">
          <div>
            <p className="eyebrow">Staff transport and car rental across Pakistan</p>

            <h1 className="mt-5 text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
              The right vehicle,
              <br />
              <span className="text-accent">priced honestly</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg text-fg-muted">
              {site.name} runs coasters, vans and buses for companies moving
              staff and groups, alongside cars and SUVs for everyday hire. Every
              quote is built from the distance, the vehicle and the day&rsquo;s
              fuel price, so you see the arithmetic before you commit. Walk
              around the vehicle in 3D first.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/fleet" size="lg">
                Browse the fleet
              </ButtonLink>
              <ButtonLink href="/fare-calculator" variant="outline" size="lg">
                Calculate a fare
              </ButtonLink>
            </div>

          </div>

          <div className="relative">
            <HeroQuoteCard />
          </div>
        </div>

        {/* The vehicle band. The coaster gets the full width rather than a
            column, because squeezing it beside the quote card left one side of
            the screen empty and the vehicle too small to read. */}
        <div className="relative grid items-center gap-10 border-t border-edge py-12 lg:grid-cols-[0.85fr_1.15fr] lg:py-14">
          <dl className="grid max-w-lg grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-4xl text-fg lg:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block font-ui text-[0.6875rem] tracking-[0.1em] text-fg-muted uppercase">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {shot && hero ? (
            <figure className="relative">
              {/* A soft disc, so the cut-out is not floating on nothing. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-[-4%] top-[10%] bottom-[14%] rounded-[50%] bg-[radial-gradient(58%_58%_at_50%_52%,rgba(18,55,133,0.12),transparent_72%)]"
              />

              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                priority
                sizes="(min-width: 1024px) 56vw, 92vw"
                className="relative w-full drop-shadow-[0_26px_38px_rgba(13,14,18,0.18)]"
              />

              <figcaption className="relative mt-1 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="font-display text-xl">
                  {hero.make} {hero.model}
                </span>
                <span className="font-ui text-xs tracking-[0.12em] text-fg-muted uppercase">
                  {hero.specs.seats} seats &middot; {hero.unitsInFleet} in the
                  fleet &middot; from{" "}
                  <span className="text-price">
                    {formatPkr(hero.rates.withFuelDaily)}
                  </span>{" "}
                  a day
                </span>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
