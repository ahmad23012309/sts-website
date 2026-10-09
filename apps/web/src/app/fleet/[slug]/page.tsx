import Link from "next/link";
import { notFound } from "next/navigation";
import { Fuel, Gauge, Luggage, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VehicleMedia } from "@/components/vehicle/VehicleMedia";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { SketchfabViewer } from "@/components/vehicle/SketchfabViewer";
import { AvailabilityCalendar } from "@/components/vehicle/AvailabilityCalendar";
import { BookingPanel } from "@/components/vehicle/BookingPanel";
import { getAvailability, getFuelRates, getVehicle, getVehicles } from "@/lib/cms";
import { hasModel } from "@/lib/cms/model3d";
import {
  categoryLabels,
  fuelLabels,
  transmissionLabels,
  vehicleFullName,
} from "@/lib/vehicleDisplay";
import { formatPkr, formatPkrPrecise } from "@/lib/utils";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  vehicleJsonLd,
} from "@/lib/seo";

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) return {};

  const name = vehicleFullName(vehicle);
  return buildMetadata({
    title: `${name} for Hire | Rates, Specifications and Availability`,
    description: `Hire a ${name} in Pakistan. ${vehicle.specs.seats} seats, ${transmissionLabels[vehicle.specs.transmission].toLowerCase()}, ${vehicle.specs.mileageCityKmpl} km per litre in the city. With-fuel and without-fuel rates, full specifications and availability.`,
    path: `/fleet/${vehicle.slug}`,
  });
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) notFound();

  const [all, fuelRates, availability] = await Promise.all([
    getVehicles(),
    getFuelRates(),
    getAvailability(vehicle.id),
  ]);

  const name = vehicleFullName(vehicle);
  const similar = all
    .filter(
      (item) => item.category === vehicle.category && item.slug !== vehicle.slug,
    )
    .slice(0, 3);

  const fuelPrice =
    vehicle.specs.fuelType === "diesel" ? fuelRates.diesel : fuelRates.petrol;
  const costPerKmCity = fuelPrice / vehicle.specs.mileageCityKmpl;
  const costPerKmHighway = fuelPrice / vehicle.specs.mileageHighwayKmpl;

  const keySpecs = [
    { Icon: Users, label: "Seats", value: String(vehicle.specs.seats) },
    {
      Icon: Gauge,
      label: "Transmission",
      value: transmissionLabels[vehicle.specs.transmission],
    },
    {
      Icon: Fuel,
      label: "Fuel",
      value: fuelLabels[vehicle.specs.fuelType],
    },
    { Icon: Luggage, label: "Luggage", value: `${vehicle.specs.luggage} bags` },
  ];

  const fullSpecs: [string, string][] = [
    ["Make", vehicle.make],
    ["Model", vehicle.model],
    ["Variant", vehicle.variant],
    ["Year", String(vehicle.year)],
    ["Class", categoryLabels[vehicle.category]],
    ["Engine", `${vehicle.specs.engineCc} cc`],
    ["Transmission", transmissionLabels[vehicle.specs.transmission]],
    ["Fuel", fuelLabels[vehicle.specs.fuelType]],
    ["Seats", String(vehicle.specs.seats)],
    ["Doors", String(vehicle.specs.doors)],
    ["Luggage", `${vehicle.specs.luggage} bags`],
    ["Air conditioning", vehicle.specs.airConditioning ? "Yes" : "No"],
    ["Consumption, city", `${vehicle.specs.mileageCityKmpl} km/l`],
    ["Consumption, highway", `${vehicle.specs.mileageHighwayKmpl} km/l`],
    ["In our fleet", `${vehicle.unitsInFleet}`],
  ];

  const rateRows: [string, number][] = [
    ["Within city, with fuel", vehicle.rates.withFuelDaily],
    ["Within city, without fuel", vehicle.rates.withoutFuelDaily],
    ["Out of station, per day", vehicle.rates.outOfCityDaily],
    ["Per kilometre, out of city", vehicle.rates.perKm],
    ["Overtime, per hour", vehicle.rates.overtimePerHour],
    ["Driver allowance, per day", vehicle.rates.driverAllowance],
    ["Night stay", vehicle.rates.nightStayCharge],
    ["Security deposit", vehicle.rates.securityDeposit],
  ];

  return (
    <div className="py-10 lg:py-14">
      <Container>
        <nav aria-label="Breadcrumb" className="font-ui text-xs text-fg-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/fleet" className="hover:text-accent">
                Fleet
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={`/fleet/category/${vehicle.category}`}
                className="hover:text-accent"
              >
                {categoryLabels[vehicle.category]}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-fg">{name}</li>
          </ol>
        </nav>

        <header className="mt-6">
          <p className="eyebrow">{categoryLabels[vehicle.category]}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">{name}</h1>
          <p className="mt-3 font-ui text-sm text-fg-muted">
            {vehicle.year} &middot; {vehicle.specs.seats} seats &middot;{" "}
            {transmissionLabels[vehicle.specs.transmission]} &middot;{" "}
            {fuelLabels[vehicle.specs.fuelType]} &middot; {vehicle.unitsInFleet}{" "}
            in our fleet
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          <div>
            {hasModel(vehicle.model3d) ? (
              <SketchfabViewer
                model={vehicle.model3d}
                poster={
                  <div className="aspect-[16/10] w-full">
                    <VehicleMedia vehicle={vehicle} sizes="(min-width: 1024px) 60vw, 100vw" priority />
                  </div>
                }
              />
            ) : (
              <div className="aspect-[16/10] w-full overflow-hidden rounded-card border border-edge">
                <VehicleMedia vehicle={vehicle} sizes="(min-width: 1024px) 60vw, 100vw" priority />
              </div>
            )}

            {vehicle.colors.length > 0 ? (
              <div className="mt-6">
                <h2 className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
                  Colours we stock
                </h2>
                <ul className="mt-3 flex flex-wrap gap-4">
                  {vehicle.colors.map((colour) => (
                    <li key={colour.hex} className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="h-7 w-7 rounded-full border border-edge-strong"
                        style={{ backgroundColor: colour.hex }}
                      />
                      <span className="font-ui text-sm text-fg-muted">
                        {colour.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-ui text-xs text-fg-faint">
                  The colour available on your dates is confirmed when you book.
                </p>
              </div>
            ) : null}

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {keySpecs.map((spec) => (
                <li
                  key={spec.label}
                  className="rounded-card border border-edge bg-panel p-4 text-center"
                >
                  <spec.Icon className="mx-auto h-5 w-5 text-accent" aria-hidden />
                  <p className="mt-2.5 font-ui text-sm font-semibold text-fg">
                    {spec.value}
                  </p>
                  <p className="font-ui text-[0.625rem] tracking-[0.08em] text-fg-faint uppercase">
                    {spec.label}
                  </p>
                </li>
              ))}
            </ul>

            {vehicle.features.length > 0 ? (
              <section className="mt-10">
                <h2 className="text-2xl">What it comes with</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {vehicle.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-fg-muted">
                      <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-red" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="mt-12">
              <h2 className="text-2xl">Running cost at today&rsquo;s fuel price</h2>
              <p className="mt-3 text-fg-muted">
                Calculated at {formatPkrPrecise(fuelPrice)} per litre for{" "}
                {fuelLabels[vehicle.specs.fuelType].toLowerCase()}, the rate in
                force on {fuelRates.effectiveFrom}. This is what the fuel alone
                costs; it is already included in the with-fuel rate.
              </p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-card border border-edge bg-panel p-5">
                  <dt className="font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                    In the city
                  </dt>
                  <dd className="tabular mt-2 text-2xl font-semibold text-price">
                    {formatPkr(Math.round(costPerKmCity))}
                    <span className="ml-1 font-ui text-xs font-medium text-fg-faint">
                      per km
                    </span>
                  </dd>
                  <dd className="mt-1 font-ui text-xs text-fg-faint">
                    At {vehicle.specs.mileageCityKmpl} km per litre
                  </dd>
                </div>
                <div className="rounded-card border border-edge bg-panel p-5">
                  <dt className="font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
                    On the highway
                  </dt>
                  <dd className="tabular mt-2 text-2xl font-semibold text-price">
                    {formatPkr(Math.round(costPerKmHighway))}
                    <span className="ml-1 font-ui text-xs font-medium text-fg-faint">
                      per km
                    </span>
                  </dd>
                  <dd className="mt-1 font-ui text-xs text-fg-faint">
                    At {vehicle.specs.mileageHighwayKmpl} km per litre
                  </dd>
                </div>
              </dl>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl">Rates</h2>
              <table className="mt-4 w-full border-collapse text-left">
                <tbody>
                  {rateRows.map(([label, value]) => (
                    <tr key={label} className="border-b border-edge">
                      <th
                        scope="row"
                        className="py-3 pr-4 font-ui text-sm font-normal text-fg-muted"
                      >
                        {label}
                      </th>
                      <td className="tabular py-3 text-right text-sm font-semibold text-fg">
                        {formatPkr(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 font-ui text-xs text-fg-faint">
                Rates exclude tolls and parking unless agreed. The with-fuel rate
                moves with the notified fuel price.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl">Full specification</h2>
              <table className="mt-4 w-full border-collapse text-left">
                <tbody>
                  {fullSpecs.map(([label, value]) => (
                    <tr key={label} className="border-b border-edge">
                      <th
                        scope="row"
                        className="py-3 pr-4 font-ui text-sm font-normal text-fg-muted"
                      >
                        {label}
                      </th>
                      <td className="py-3 text-right font-ui text-sm font-medium text-fg">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 font-ui text-xs text-fg-faint">
                Specifications are indicative and confirmed at the time of
                booking.
              </p>
            </section>
          </div>

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <BookingPanel vehicle={vehicle} />
            <AvailabilityCalendar availability={availability} />
          </div>
        </div>

        {similar.length > 0 ? (
          <section className="mt-16 border-t border-edge pt-12">
            <h2 className="text-3xl">Similar vehicles</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <VehicleCard key={item.id} vehicle={item} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>

      <JsonLd
        data={vehicleJsonLd({
          name,
          description: `${name} available for hire in Pakistan with or without a driver.`,
          path: `/fleet/${vehicle.slug}`,
          make: vehicle.make,
          model: vehicle.model,
          price: vehicle.rates.withFuelDaily,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fleet", path: "/fleet" },
          {
            name: categoryLabels[vehicle.category],
            path: `/fleet/category/${vehicle.category}`,
          },
          { name, path: `/fleet/${vehicle.slug}` },
        ])}
      />
    </div>
  );
}
