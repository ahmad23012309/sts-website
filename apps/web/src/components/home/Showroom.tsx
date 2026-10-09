import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { SketchfabViewer } from "@/components/vehicle/SketchfabViewer";
import { hasModel } from "@/lib/cms/model3d";
import { VehicleMedia } from "@/components/vehicle/VehicleMedia";
import { getVehicles } from "@/lib/cms";

/**
 * Showcases the first vehicle that has a 3D model attached.
 *
 * The section removes itself while no model has been chosen, rather than
 * showing an empty frame. It appears the moment a Sketchfab model is recorded
 * against any vehicle.
 */
export async function Showroom() {
  const vehicles = await getVehicles();
  const vehicle = vehicles.find((item) => hasModel(item.model3d));
  if (!vehicle || !hasModel(vehicle.model3d)) return null;

  const withModels = vehicles.filter((item) => hasModel(item.model3d));

  return (
    <section className="overflow-hidden border-y border-edge bg-page-alt py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="3D showroom"
              title="Walk around it before you book"
              description="It turns on its own, and you can take hold of it. Look inside, judge the proportions, decide before you call. The same viewer sits on every vehicle page that has a model."
            />

            <p className="mt-8 font-ui text-sm text-fg-muted">
              Showing the {vehicle.make} {vehicle.model} {vehicle.variant}.{" "}
              {withModels.length} of our vehicles have a 3D model so far.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/fleet/${vehicle.slug}`} size="lg">
                View this vehicle
              </ButtonLink>
              <ButtonLink href="/fleet" variant="outline" size="lg">
                Browse the fleet
              </ButtonLink>
            </div>

            <p className="mt-7 text-fg-muted">
              Not every model in our fleet exists as a 3D asset. Where one is not
              available, the vehicle&rsquo;s own photographs are shown instead.{" "}
              <Link
                href="/attributions"
                className="text-accent underline decoration-red/40 decoration-2 underline-offset-[5px] hover:decoration-red"
              >
                Model credits
              </Link>
              .
            </p>
          </div>

          <SketchfabViewer
            model={vehicle.model3d}
            autoLoad
            className="relative"
            poster={
              <VehicleMedia
                vehicle={vehicle}
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            }
          />
        </div>
      </Container>
    </section>
  );
}
