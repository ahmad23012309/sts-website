import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { getVehicles } from "@/lib/cms";
import { hasModel } from "@/lib/cms/model3d";

export const metadata = buildMetadata({
  title: "Credits and Attributions",
  description:
    "Credits for the third-party 3D models used on this website, with their authors and licence terms.",
  path: "/attributions",
});

export default async function AttributionsPage() {
  const vehicles = await getVehicles();
  const credited = vehicles.filter((vehicle) => hasModel(vehicle.model3d));

  return (
    <div className="py-16 lg:py-24">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Credits"
          title="Attributions"
          description="The 3D models on this site are published by their authors on Sketchfab and used under the licences shown. Photographs of our vehicles are our own."
        />

        <div className="mt-12 max-w-3xl">
          {credited.length === 0 ? (
            <p className="text-fg-muted">
              No third-party 3D models are in use yet. Each one will be listed
              here, with its author and licence, as it is added.
            </p>
          ) : (
            <ul className="divide-y divide-edge border-y border-edge">
              {credited.map((vehicle) => {
                const model = vehicle.model3d;
                if (!hasModel(model)) return null;
                return (
                  <li key={vehicle.id} className="py-5">
                    <p className="font-ui text-sm font-semibold text-fg">
                      {vehicle.make} {vehicle.model} {vehicle.variant}
                    </p>
                    <p className="mt-1 text-fg-muted">
                      <a
                        href={model.modelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline decoration-red/40 decoration-2 underline-offset-[5px] hover:decoration-red"
                      >
                        {model.title}
                      </a>{" "}
                      by{" "}
                      <a
                        href={model.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline decoration-red/40 decoration-2 underline-offset-[5px] hover:decoration-red"
                      >
                        {model.authorName}
                      </a>
                      , licensed under {model.license}, via Sketchfab.
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </div>
  );
}
