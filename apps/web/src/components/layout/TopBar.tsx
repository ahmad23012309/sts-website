import { Clock, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { site } from "@/lib/site";

export function TopBar() {
  return (
    <div className="hidden border-b border-line/60 bg-surface md:block">
      <Container>
        <div className="flex h-10 items-center justify-between gap-6 font-ui text-xs text-muted">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden />
              {site.contact.city}, {site.contact.country}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gold" aria-hidden />
              {site.contact.hours}
            </span>
            <a
              href={`mailto:${site.contact.email}`}
              className="hidden items-center gap-2 transition-colors hover:text-gold lg:inline-flex"
            >
              <Mail className="h-3.5 w-3.5 text-gold" aria-hidden />
              {site.contact.email}
            </a>
          </div>
          <SocialLinks size="sm" />
        </div>
      </Container>
    </div>
  );
}
