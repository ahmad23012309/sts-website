import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompareTool } from "@/components/compare/CompareTool";
import { getFuelRates, getVehicles } from "@/lib/cms";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compare Vehicles",
  description:
    "Put vehicles of the same class side by side: seats, consumption, fuel cost per kilometre and every rate, with the better figure marked.",
  path: "/compare",
});

export default async function ComparePage() {
  const [vehicles, fuelRates] = await Promise.all([
    getVehicles(),
    getFuelRates(),
  ]);

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Compare"
          title="Put them side by side"
          description="Two or three vehicles of the same class, every figure in one table, and the better number in each row marked so you are not squinting at it."
        />

        <div className="mt-12">
          <Suspense
            fallback={<p className="font-ui text-sm text-fg-muted">Loading…</p>}
          >
            <CompareTool vehicles={vehicles} fuelRates={fuelRates} />
          </Suspense>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ])}
      />
    </div>
  );
}
