import { Fuel } from "lucide-react";
import { getFuelRates, getVehicles } from "@/lib/cms";
import { site } from "@/lib/site";

/**
 * The running strip above the header.
 *
 * It carries the two things a visitor to a rental site actually wants in the
 * first second: what fuel costs today, because every with-fuel quote is built
 * on it, and what the company's record is.
 *
 * The items are rendered twice. The animation moves the track by exactly half
 * its width, so the second copy lands where the first began and the loop has
 * no visible seam. The duplicate is hidden from assistive technology, the
 * strip pauses on hover and on keyboard focus, and under
 * prefers-reduced-motion it stops moving and becomes a scrollable strip.
 */
export async function AnnouncementTicker() {
  const [rates, vehicles] = await Promise.all([getFuelRates(), getVehicles()]);

  const fleetSize = vehicles.reduce(
    (sum, vehicle) => sum + vehicle.unitsInFleet,
    0,
  );

  const items: { key: string; label: string; value: string; fuel?: boolean }[] = [
    { key: "petrol", label: "Petrol today", value: `PKR ${rates.petrol.toFixed(2)}/L`, fuel: true },
    { key: "diesel", label: "Diesel today", value: `PKR ${rates.diesel.toFixed(2)}/L`, fuel: true },
    { key: "octane", label: "Hi-octane today", value: `PKR ${rates.hiOctane.toFixed(2)}/L`, fuel: true },
    { key: "years", label: "In service", value: `${site.claims.yearsInService} years` },
    { key: "fleet", label: "Fleet", value: `${fleetSize} vehicles` },
    { key: "clients", label: "Clients served", value: site.claims.clientsServed },
    { key: "ontime", label: "On-time record", value: site.claims.onTimeRate },
  ];

  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li
          key={item.key}
          className="flex items-center gap-2 px-6 font-ui text-xs whitespace-nowrap"
        >
          {item.fuel ? (
            <Fuel className="h-3.5 w-3.5 text-accent" aria-hidden />
          ) : (
            <span aria-hidden className="h-1 w-1 rounded-full bg-red" />
          )}
          <span className="text-fg-muted">{item.label}</span>
          <span className="tabular font-semibold text-yellow">{item.value}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-surface="dark"
      className="ticker overflow-hidden border-b border-edge bg-page py-2.5 text-fg"
      role="region"
      aria-label="Fuel prices today and our record"
    >
      <div className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
