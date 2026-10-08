import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { getFeaturedVehicles } from "@/lib/cms";

export async function FleetPreview() {
  const vehicles = (await getFeaturedVehicles()).slice(0, 6);

  return (
    <section className="border-y border-edge bg-page-alt py-20 lg:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The fleet"
            title="Pick the vehicle, see the price"
            description="Every vehicle carries its own with-fuel and without-fuel rate, its consumption figures and a full specification sheet."
          />
          <ButtonLink href="/fleet" variant="outline" size="md">
            All vehicles
          </ButtonLink>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <Reveal key={vehicle.id} delay={(index % 3) * 70}>
              <VehicleCard vehicle={vehicle} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
