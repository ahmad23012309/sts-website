"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav, type NavItem } from "@/lib/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-ink/92 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <NavEntry
                  key={item.label}
                  item={item}
                  isOpen={openMenu === item.label}
                  isActive={pathname.startsWith(item.href)}
                  onOpen={() => setOpenMenu(item.children ? item.label : null)}
                />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 font-ui text-sm text-muted transition-colors hover:text-gold xl:flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="tabular">{site.contact.phone}</span>
            </a>
            <ButtonLink href="/book" size="md" className="hidden sm:inline-flex">
              Book Now
            </ButtonLink>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-text lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </Container>

      {mobileOpen ? <MobileNav /> : null}
    </header>
  );
}

function NavEntry({
  item,
  isOpen,
  isActive,
  onOpen,
}: {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean;
  onOpen: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className="relative" onMouseEnter={onOpen}>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1.5 rounded-pill px-4 py-2 font-ui text-sm font-medium transition-colors",
          isActive ? "text-gold" : "text-text/85 hover:text-gold",
        )}
      >
        {item.label}
        {hasChildren ? (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden
          />
        ) : null}
      </Link>

      {hasChildren && isOpen ? (
        item.mega ? (
          <div className="absolute left-1/2 top-full z-50 w-[46rem] -translate-x-1/2 pt-3">
            <div className="grid grid-cols-3 gap-1 rounded-card border border-line bg-card/97 p-3 shadow-lift backdrop-blur-xl">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="rounded-[0.5rem] p-4 transition-colors hover:bg-elevated"
                >
                  <span className="block font-ui text-sm font-semibold text-text">
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className="mt-1 block text-sm leading-snug text-muted">
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute left-0 top-full z-50 w-60 pt-3">
            <div className="rounded-card border border-line bg-card/97 p-2 shadow-lift backdrop-blur-xl">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block rounded-[0.5rem] px-4 py-2.5 font-ui text-sm text-text/85 transition-colors hover:bg-elevated hover:text-gold"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )
      ) : null}
    </li>
  );
}

function MobileNav() {
  return (
    <div className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto border-t border-line bg-ink lg:hidden">
      <Container className="py-6">
        <ul className="space-y-1">
          {primaryNav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="block py-3 font-display text-2xl text-text"
              >
                {item.label}
              </Link>
              {item.children?.length ? (
                <ul className="mb-3 ml-1 space-y-1 border-l border-line pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block py-1.5 font-ui text-sm text-muted"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href="/book" size="lg">
            Book Now
          </ButtonLink>
          <ButtonLink
            href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
            variant="outline"
            size="lg"
          >
            Call {site.contact.phone}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
