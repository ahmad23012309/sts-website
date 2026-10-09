import { getFuelRates, getVehicles } from "@/lib/cms";
import { site } from "@/lib/site";
import {
  AnnouncementSlides,
  type Announcement,
} from "@/components/layout/AnnouncementSlides";

/**
 * The strip above the header.
 *
 * It carries the two things a visitor to a rental site wants in the first
 * second: what fuel costs today, because every with-fuel quote is built on it,
 * and what the company's record is.
 */
export async function AnnouncementTicker() {
  const [rates, vehicles] = await Promise.all([getFuelRates(), getVehicles()]);

  const fleetSize = vehicles.reduce(
    (sum, vehicle) => sum + vehicle.unitsInFleet,
    0,
  );

  const items: Announcement[] = [
    { key: "petrol", label: "Petrol today", value: `PKR ${rates.petrol.toFixed(2)} per litre` },
    { key: "diesel", label: "Diesel today", value: `PKR ${rates.diesel.toFixed(2)} per litre` },
    { key: "octane", label: "Hi-octane today", value: `PKR ${rates.hiOctane.toFixed(2)} per litre` },
    { key: "years", label: "In service", value: `${site.claims.yearsInService} years` },
    { key: "fleet", label: "Fleet", value: `${fleetSize} vehicles` },
    { key: "clients", label: "Clients served", value: site.claims.clientsServed },
    { key: "ontime", label: "On-time record", value: site.claims.onTimeRate },
    { key: "offer", label: site.offer.headline, value: `Code ${site.offer.code}` },
  ];

  return (
    <div className="bg-yellow py-2">
      <AnnouncementSlides items={items} />
    </div>
  );
}
