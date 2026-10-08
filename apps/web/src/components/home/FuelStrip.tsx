import Link from "next/link";
import { ArrowRight, Fuel } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getFuelRates } from "@/lib/cms";

export async function FuelStrip() {
  const rates = await getFuelRates();

  const entries = [
    { label: "Petrol", value: rates.petrol },
    { label: "Diesel", value: rates.diesel },
    { label: "Hi-Octane", value: rates.hiOctane },
  ];

  const effective = new Date(rates.effectiveFrom).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="py-14">
      <Container>
        <div className="flex flex-col gap-7 rounded-card border border-line bg-card p-7 lg:flex-row lg:items-center lg:justify-between lg:p-9">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-red/45 text-red-bright">
              <Fuel className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl">Today&rsquo;s fuel prices</h2>
              <p className="mt-1 font-ui text-xs text-muted">
                Effective {effective}. Every with-fuel quote uses these figures.
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-6 sm:gap-10">
            {entries.map((entry) => (
              <div key={entry.label}>
                <dt className="font-ui text-[0.625rem] tracking-[0.14em] text-muted uppercase">
                  {entry.label}
                </dt>
                <dd className="tabular mt-1.5 text-2xl font-semibold text-yellow">
                  {entry.value.toFixed(2)}
                  <span className="ml-1 font-ui text-[0.625rem] font-medium tracking-[0.1em] text-faint uppercase">
                    PKR/L
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/fuel-prices"
            className="inline-flex items-center gap-2 font-ui text-sm font-semibold tracking-wide text-red-bright uppercase transition-colors hover:text-yellow"
          >
            Price history
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
