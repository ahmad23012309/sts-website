import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";

const categories = [
  { value: "economy", label: "Economy" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
  { value: "van", label: "Van" },
  { value: "coaster", label: "Coaster" },
];

const fieldClass =
  "h-12 w-full rounded-[0.5rem] border border-line bg-ink px-4 font-ui text-sm text-text focus:border-gold focus:outline-none";

const labelClass =
  "mb-1.5 block font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-muted uppercase";

/**
 * Opens the fare calculator with the visitor's answers already filled in.
 *
 * Deliberately a plain GET form: it needs no JavaScript, it costs nothing in
 * bundle size, and the resulting URL is shareable.
 */
export function HeroQuoteCard() {
  return (
    <div className="rounded-card border border-line bg-card/85 p-7 shadow-lift backdrop-blur-xl sm:p-8">
      <p className="eyebrow">Estimate a fare</p>
      <h2 className="mt-3 text-3xl">Know the price first</h2>
      <p className="mt-2.5 text-[0.95rem] text-muted">
        Three answers and you get an itemised estimate at today&rsquo;s fuel
        rate.
      </p>

      <form action="/fare-calculator" method="get" className="mt-7 space-y-4">
        <div>
          <label htmlFor="hero-origin" className={labelClass}>
            Picking up from
          </label>
          <select id="hero-origin" name="origin" className={fieldClass} defaultValue={site.cities[0]}>
            {site.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hero-category" className={labelClass}>
            Vehicle type
          </label>
          <select id="hero-category" name="category" className={fieldClass} defaultValue="sedan">
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hero-date" className={labelClass}>
            Pick-up date
          </label>
          <input id="hero-date" type="date" name="pickupDate" className={fieldClass} />
        </div>

        <button
          type="submit"
          className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-pill bg-yellow font-ui text-sm font-semibold tracking-wide text-ink uppercase transition-colors hover:bg-yellow-dark"
        >
          Get an estimate
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </form>

      <p className="mt-4 text-center font-ui text-[0.6875rem] text-faint">
        No payment details. No account needed.
      </p>
    </div>
  );
}
