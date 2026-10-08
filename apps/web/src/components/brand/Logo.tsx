import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Wordmark placeholder.
 *
 * The supplied logo file replaces the markup inside this component. Keeping the
 * lockup in one place means that swap touches nothing else in the codebase.
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
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 transition-colors group-hover:border-gold">
        <span className="font-display text-base leading-none text-gold">
          {site.shortName}
        </span>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg tracking-[0.06em] text-text">
            Sidhu Travel
          </span>
          <span className="mt-1 font-ui text-[0.5625rem] font-semibold tracking-[0.34em] text-gold">
            SERVICES
          </span>
        </span>
      ) : null}
    </Link>
  );
}
