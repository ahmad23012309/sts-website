import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getVehicles } from "@/lib/cms";
import { formatPkr } from "@/lib/utils";
import type { VehicleCategory } from "@/lib/cms/types";

/**
 * What the fleet looks like, before anyone reads a specification.
 *
 * Four tiles, one per job the business is hired for, each showing the vehicle
 * people picture when they think of that job. The counts and the prices are
 * read from the register, so a tile cannot promise a vehicle that is not there.
 */

const groups: {
  slug: string;
  label: string;
  blurb: string;
  categories: VehicleCategory[];
}[] = [
  {
    slug: "toyota-coaster",
    label: "Coaches and coasters",
    blurb: "Daily staff routes, group tours and event shuttles.",
    categories: ["coaster", "bus"],
  },
  {
    slug: "toyota-hiace",
    label: "Vans",
    blurb: "Smaller teams, airport runs and family travel.",
    categories: ["van"],
  },
  {
    slug: "toyota-corolla-altis",
    label: "Saloons and city cars",
    blurb: "Business travel, daily hire and long-term lease.",
    categories: ["sedan", "economy"],
  },
  {
    slug: "toyota-land-cruiser-axg",
    label: "SUVs and executive",
    blurb: "Protocol duty, rough roads and senior management.",
    categories: ["suv", "luxury"],
  },
];

export async function FleetSpread() {
  const vehicles = await getVehicles();

  const tiles = groups.map((group) => {
    const inGroup = vehicles.filter((vehicle) =>
      group.categories.includes(vehicle.category),
    );
    const shot = vehicles.find((vehicle) => vehicle.slug === group.slug)
      ?.images[0];

    return {
      ...group,
      shot,
      units: inGroup.reduce((sum, vehicle) => sum + vehicle.unitsInFleet, 0),
      from: inGroup.length
        ? Math.min(...inGroup.map((vehicle) => vehicle.rates.withFuelDaily))
        : null,
      href: `/fleet/category/${group.categories[0]}`,
    };
  });

  return (
    <section className="border-y border-edge bg-page-alt py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="The shape of the fleet"
          title="Four jobs, four kinds of vehicle"
          description="Most enquiries fall into one of these. Start where yours sits and the prices follow."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, index) => (
            <Reveal key={tile.slug} delay={index * 70}>
              <Link
                href={tile.href}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-edge bg-panel transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-red/45 hover:shadow-lift"
              >
                <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-[linear-gradient(170deg,#ffffff_0%,#eef1f6_100%)] p-4">
                  <span
                    aria-hidden
                    className="absolute inset-x-6 bottom-5 h-6 rounded-[50%] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(13,14,18,0.16),transparent_72%)]"
                  />
                  {tile.shot ? (
                    <Image
                      src={tile.shot.src}
                      alt={tile.shot.alt}
                      width={tile.shot.width}
                      height={tile.shot.height}
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                      className="relative h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl leading-[1.08] transition-colors group-hover:text-accent">
                    {tile.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-fg-muted">
                    {tile.blurb}
                  </p>

                  <p className="mt-5 border-t border-edge pt-4 font-ui text-[0.6875rem] tracking-[0.1em] text-fg-muted uppercase">
                    {tile.units} in the fleet
                    {tile.from !== null ? (
                      <>
                        {" "}
                        &middot; from{" "}
                        <span className="text-price">
                          {formatPkr(tile.from)}
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
