import { Check, X } from "lucide-react";
import { site } from "@/lib/site";

/**
 * What the rate covers, and what it does not.
 *
 * The second list matters more than the first. Every argument at handover
 * comes from something a customer assumed was included, so naming the
 * exclusions on the page is cheaper than settling them at the counter.
 */
export function RentalTerms() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <h3 className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
          Included in the rate
        </h3>
        <ul className="mt-4 space-y-2.5">
          {site.rentalTerms.included.map((item) => (
            <li key={item} className="flex gap-3 text-[0.95rem] text-fg-muted">
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-available"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
          Not included
        </h3>
        <ul className="mt-4 space-y-2.5">
          {site.rentalTerms.excluded.map((item) => (
            <li key={item} className="flex gap-3 text-[0.95rem] text-fg-muted">
              <X className="mt-1 h-4 w-4 shrink-0 text-booked" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
