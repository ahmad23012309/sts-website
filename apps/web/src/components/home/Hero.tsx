import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { HeroQuoteCard } from "@/components/home/HeroQuoteCard";

const stats = [
  { value: "6", label: "Vehicle classes" },
  { value: String(site.cities.length), label: "Pick-up cities" },
  { value: "24/7", label: "Support and dispatch" },
];

export function Hero() {
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
        <div className="grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div>
            <p className="eyebrow">Car rental across Pakistan</p>

            <h1 className="mt-5 text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
              The right vehicle,
              <br />
              <span className="text-accent">priced honestly</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg text-fg-muted">
              {site.name} rents to individuals and runs long-term fleets for
              business. Every quote is built from the distance, the vehicle and
              the day&rsquo;s fuel price, so you see the arithmetic before you
              commit.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/fleet" size="lg">
                Browse the fleet
              </ButtonLink>
              <ButtonLink href="/fare-calculator" variant="outline" size="lg">
                Calculate a fare
              </ButtonLink>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-edge pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl text-fg">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 block font-ui text-[0.6875rem] tracking-[0.1em] text-fg-muted uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <HeroQuoteCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
