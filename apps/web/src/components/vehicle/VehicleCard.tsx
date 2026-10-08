import Link from "next/link";
import { Fuel, Gauge, Users } from "lucide-react";
import { VehicleMedia } from "@/components/vehicle/VehicleMedia";
import { ButtonLink } from "@/components/ui/Button";
import type { Vehicle } from "@/lib/cms/types";
import { site } from "@/lib/site";
import { formatPkr, whatsappLink } from "@/lib/utils";

export function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  const name = `${vehicle.make} ${vehicle.model}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-card transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift">
      <Link
        href={`/fleet/${vehicle.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        <VehicleMedia
          vehicle={vehicle}
          priority={priority}
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-pill border border-gold/40 bg-ink/80 px-3 py-1 font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-gold uppercase backdrop-blur">
          {vehicle.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-2xl">
              <Link
                href={`/fleet/${vehicle.slug}`}
                className="transition-colors hover:text-gold"
              >
                {name}
              </Link>
            </h3>
            <p className="mt-1 font-ui text-xs text-muted">
              {vehicle.variant} &middot; {vehicle.year}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular text-xl font-semibold text-yellow">
              {formatPkr(vehicle.rates.withFuelDaily)}
            </p>
            <p className="font-ui text-[0.625rem] tracking-[0.1em] text-faint uppercase">
              per day
            </p>
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-3 gap-2 border-y border-line py-4">
          <Spec icon={<Users className="h-4 w-4" aria-hidden />} label={`${vehicle.specs.seats} seats`} />
          <Spec
            icon={<Gauge className="h-4 w-4" aria-hidden />}
            label={vehicle.specs.transmission === "automatic" ? "Automatic" : "Manual"}
          />
          <Spec
            icon={<Fuel className="h-4 w-4" aria-hidden />}
            label={`${vehicle.specs.mileageCityKmpl} km/l`}
          />
        </ul>

        <div className="mt-5 flex items-center gap-2">
          <ButtonLink
            href={`/fleet/${vehicle.slug}`}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View Details
          </ButtonLink>
          <ButtonLink
            href={whatsappLink(
              site.contact.whatsapp,
              `Hello ${site.name}, I would like to book the ${name} ${vehicle.variant}.`,
            )}
            variant="whatsapp"
            size="sm"
            className="flex-1"
          >
            WhatsApp
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex flex-col items-center gap-1.5 text-center">
      <span className="text-gold">{icon}</span>
      <span className="font-ui text-[0.6875rem] text-muted">{label}</span>
    </li>
  );
}
