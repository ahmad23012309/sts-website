import Image from "next/image";
import type { Vehicle, VehicleCategory } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Renders the vehicle photograph, or a composed placeholder while the fleet
 * photography is outstanding. The placeholder is deliberate rather than a
 * broken image frame, so the layout can be reviewed before the photos arrive.
 *
 * The outline matches the body style. A saloon drawn on a 22-seat coaster is a
 * small lie that a visitor notices immediately.
 *
 * Vehicles are cut out against a light studio background, so the image is
 * contained inside a tinted panel rather than cropped to fill one. Cropping a
 * cut-out takes the wheels off.
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
      <div
        className={cn(
          "grid h-full w-full place-items-center bg-[linear-gradient(170deg,#ffffff_0%,#eef1f6_100%)] p-3",
          className,
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative grid h-full w-full place-items-center overflow-hidden bg-page-alt",
        className,
      )}
    >
      {renderOutline(vehicle.category, "w-3/5 max-w-56 text-edge-strong")}
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-ui text-[0.625rem] font-semibold tracking-[0.18em] text-fg-faint uppercase">
        Photography pending
      </span>
    </div>
  );
}

function renderOutline(category: VehicleCategory, className: string) {
  switch (category) {
    case "coaster":
    case "bus":
      return <BusOutline className={className} />;
    case "van":
      return <VanOutline className={className} />;
    case "pickup":
      return <PickupOutline className={className} />;
    default:
      return <CarOutline className={className} />;
  }
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 60"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function CarOutline({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path
        d="M8 42h144M20 42c0-5.5 4.5-10 10-10s10 4.5 10 10M120 42c0-5.5 4.5-10 10-10s10 4.5 10 10M12 42V31c0-3 2-5.6 5-6.4l22-5.8 12-9.4c1.4-1.1 3.1-1.7 4.9-1.7h34c2.2 0 4.3.9 5.8 2.5l13 13.9 23 4.6c3.3.7 5.6 3.5 5.6 6.8V42"
        {...stroke}
      />
      <path d="M50 19h52" {...stroke} />
    </Frame>
  );
}

function BusOutline({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path
        d="M8 44h144M22 44c0-5 4-9 9-9s9 4 9 9M118 44c0-5 4-9 9-9s9 4 9 9M12 44V17c0-3.3 2.7-6 6-6h118c3.3 0 6 2.7 6 6v27"
        {...stroke}
      />
      <path d="M18 21h40v12H18zM66 21h32v12H66zM106 21h30v12h-30z" {...stroke} />
      <path d="M62 11v33" {...stroke} />
    </Frame>
  );
}

function VanOutline({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path
        d="M8 44h144M24 44c0-5 4-9 9-9s9 4 9 9M116 44c0-5 4-9 9-9s9 4 9 9M12 44V22c0-3.3 2.7-6 6-6h86c2 0 3.9.9 5.1 2.5l15.6 19 11.4 2.6c3 .7 5.1 3.3 5.1 6.4V44"
        {...stroke}
      />
      <path d="M20 24h30v12H20zM58 24h30v12H58zM96 24h14l9 12H96z" {...stroke} />
    </Frame>
  );
}

function PickupOutline({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path
        d="M8 44h144M26 44c0-5 4-9 9-9s9 4 9 9M114 44c0-5 4-9 9-9s9 4 9 9M14 44V28c0-2.6 1.7-4.9 4.2-5.7l16-5 10-8.2c1.3-1 2.9-1.6 4.6-1.6h22c2.6 0 4.9 1.6 5.9 4l5 12.5h66c1.7 0 3 1.3 3 3V44"
        {...stroke}
      />
      <path d="M50 13v12M86 28v16" {...stroke} />
    </Frame>
  );
}
