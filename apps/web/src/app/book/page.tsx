import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { getPricingRules, getVehicles } from "@/lib/cms";
import { JsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book a Vehicle",
  description:
    "Book any vehicle in our fleet in one screen. Choose the vehicle, the dates and the fuel option, see the running total, and send the request.",
  path: "/book",
});

export default async function BookPage() {
  const [vehicles, rules] = await Promise.all([
    getVehicles(),
    getPricingRules(),
  ]);

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Instant booking"
          title="Everything on one screen"
          description="Pick the vehicle, set the dates, tell us where. The total updates as you go, and nothing is charged until we have confirmed availability with you."
        />

        <div className="mt-12">
          <Suspense
            fallback={
              <p className="font-ui text-sm text-fg-muted">Loading…</p>
            }
          >
            <BookingFlow vehicles={vehicles} rules={rules} />
          </Suspense>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book", path: "/book" },
        ])}
      />
    </div>
  );
}
