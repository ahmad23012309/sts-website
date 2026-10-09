import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FleetBrowser } from "@/components/fleet/FleetBrowser";
import { getVehicles } from "@/lib/cms";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Fleet | Coasters, Vans, Buses, Cars and SUVs",
  description:
    "Every vehicle we run, with daily rates, seating, consumption and full specifications. Filter by type, seats, transmission and fuel.",
  path: "/fleet",
});

export default async function FleetPage() {
  const vehicles = await getVehicles();
  const totalUnits = vehicles.reduce(
    (sum, vehicle) => sum + vehicle.unitsInFleet,
    0,
  );

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="The fleet"
          title="Every vehicle we run"
          description={`${totalUnits} vehicles across ${vehicles.length} models, from 22-seat coasters to saloons. Each one carries its own rates, consumption figures and specification sheet.`}
        />

        <div className="mt-12">
          <Suspense
            fallback={
              <p className="font-ui text-sm text-fg-muted">Loading the fleet…</p>
            }
          >
            <FleetBrowser vehicles={vehicles} />
          </Suspense>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fleet", path: "/fleet" },
        ])}
      />
    </div>
  );
}
