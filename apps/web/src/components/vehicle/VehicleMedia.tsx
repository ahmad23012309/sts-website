import Image from "next/image";
import type { Vehicle } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Renders the vehicle photograph, or a composed placeholder while the fleet
 * photography is outstanding. The placeholder is deliberate rather than a
 * broken image frame, so the layout can be reviewed before the photos arrive.
 */
export function VehicleMedia({
  vehicle,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
}: {
  vehicle: Vehicle;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const image = vehicle.images[0];

  if (image) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative grid h-full w-full place-items-center overflow-hidden bg-page-alt",
        className,
      )}
    >
      <CarSilhouette className="w-3/5 max-w-56 text-edge-strong" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-ui text-[0.625rem] font-semibold tracking-[0.18em] text-fg-faint uppercase">
        Photography pending
      </span>
    </div>
  );
}

function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 60"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 42h144M20 42c0-5.5 4.5-10 10-10s10 4.5 10 10M120 42c0-5.5 4.5-10 10-10s10 4.5 10 10M12 42V31c0-3 2-5.6 5-6.4l22-5.8 12-9.4c1.4-1.1 3.1-1.7 4.9-1.7h34c2.2 0 4.3.9 5.8 2.5l13 13.9 23 4.6c3.3.7 5.6 3.5 5.6 6.8V42"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 19h52"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
