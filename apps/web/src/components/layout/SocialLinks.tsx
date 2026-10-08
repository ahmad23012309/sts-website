import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/components/icons/BrandIcons";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const platforms = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "tiktok", label: "TikTok", Icon: TiktokIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
] as const;

/**
 * Renders only the platforms that have a URL. Social links become editable from
 * the backend, so an empty value must degrade cleanly rather than link nowhere.
 */
export function SocialLinks({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const available = platforms.filter(({ key }) => site.social[key].length > 0);
  if (available.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {available.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={site.social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "grid place-items-center rounded-full text-muted transition-colors hover:text-gold",
              size === "sm" ? "h-7 w-7" : "h-10 w-10 border border-line",
            )}
          >
            <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </a>
        </li>
      ))}
    </ul>
  );
}
