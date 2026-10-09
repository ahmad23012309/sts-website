import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FleetBrowser } from "@/components/fleet/FleetBrowser";
import { getVehicles } from "@/lib/cms";
import type { VehicleCategory } from "@/lib/cms/types";
import {
  categoryBlurbs,
  categoryLabels,
  orderedCategories,
} from "@/lib/vehicleDisplay";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return orderedCategories.map((category) => ({ category }));
}

function isCategory(value: string): value is VehicleCategory {
  return (orderedCategories as string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) return {};

  const label = categoryLabels[category];
  return buildMetadata({
    title: `${label} Hire in Pakistan | Rates and Specifications`,
    description: `${categoryBlurbs[category]} Daily rates, seating, fuel consumption and availability.`,
    path: `/fleet/category/${category}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const all = await getVehicles();
  const vehicles = all.filter((vehicle) => vehicle.category === category);
  if (vehicles.length === 0) notFound();

  const units = vehicles.reduce(
    (sum, vehicle) => sum + vehicle.unitsInFleet,
    0,
  );
  const label = categoryLabels[category];

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Fleet"
          title={`${label} hire`}
          description={`${categoryBlurbs[category]} We run ${units} ${
            units === 1 ? "vehicle" : "vehicles"
          } in this class.`}
        />

        <div className="mt-12">
          <Suspense
            fallback={
              <p className="font-ui text-sm text-fg-muted">Loading…</p>
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
          { name: label, path: `/fleet/category/${category}` },
        ])}
      />
    </div>
  );
}
