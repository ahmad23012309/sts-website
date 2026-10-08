import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The company mark beside the wordmark.
 *
 * The supplied artwork is a raster scan, so it is rendered at twice its display
 * size to stay sharp. A vector version should replace the file in
 * public/brand/ when one is available; nothing else needs to change.
 */
export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <Image
        src="/brand/sts-logo.png"
        alt=""
        width={96}
        height={96}
        priority
        className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-105"
      />
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg tracking-[0.06em] text-text">
            Sidhu Travel
          </span>
          <span className="mt-1 font-ui text-[0.5625rem] font-semibold tracking-[0.34em] text-red-bright">
            SERVICES
          </span>
        </span>
      ) : null}
    </Link>
  );
}
