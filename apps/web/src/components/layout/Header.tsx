"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { navLeft, navRight, primaryNav, type NavItem } from "@/lib/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The logo sits in the centre with the menu split around it.
 *
 * The outer grid is 1fr / auto / 1fr, so the mark stays optically centred no
 * matter how wide either half of the menu grows.
 */
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
      data-surface="dark"
      className={cn(
        "sticky top-0 z-50 border-b border-edge bg-page text-fg transition-shadow duration-300",
        scrolled && "shadow-[0_10px_30px_-18px_rgba(13,14,18,0.9)]",
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <Container>
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6">
          <nav aria-label="Primary" className="hidden justify-self-start xl:block">
            <ul className="flex items-center gap-1">
              {navLeft.map((item) => (
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

          {/* On narrow screens the logo takes the left-hand slot. */}
          <div className="justify-self-start xl:hidden">
            <Logo />
          </div>
          <div className="hidden justify-self-center xl:block">
            <Logo />
          </div>

          <div className="flex items-center justify-self-end gap-1 xl:gap-2">
            <nav aria-label="Secondary" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {navRight.map((item) => (
                  <NavEntry
                    key={item.label}
                    item={item}
                    isOpen={openMenu === item.label}
                    isActive={pathname.startsWith(item.href)}
                    onOpen={() => setOpenMenu(item.children ? item.label : null)}
                    alignRight
                  />
                ))}
              </ul>
            </nav>

            <span aria-hidden className="mx-2 hidden h-6 w-px bg-edge xl:block" />

            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${site.contact.phone}`}
              className="hidden h-10 w-10 place-items-center rounded-full border border-edge text-fg-muted transition-colors hover:border-red hover:text-accent lg:grid"
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>

            <ButtonLink href="/book" size="md" className="hidden sm:inline-flex">
              Book Now
            </ButtonLink>

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-edge text-fg xl:hidden"
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
  alignRight = false,
}: {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean;
  onOpen: () => void;
  alignRight?: boolean;
}) {
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className="relative" onMouseEnter={onOpen}>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1.5 rounded-pill px-3.5 py-2 font-ui text-sm font-medium whitespace-nowrap transition-colors",
          isActive ? "text-accent" : "text-fg/85 hover:text-accent",
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
          <div className="absolute top-full left-1/2 z-50 w-[48rem] -translate-x-1/2 pt-3">
            <div className="grid grid-cols-4 gap-1 rounded-card border border-edge bg-panel/97 p-3 shadow-lift backdrop-blur-xl">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="rounded-[0.5rem] p-3.5 transition-colors hover:bg-panel-alt"
                >
                  <span className="block font-ui text-sm font-semibold text-fg">
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className="mt-1 block text-sm leading-snug text-fg-muted">
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "absolute top-full z-50 w-60 pt-3",
              alignRight ? "right-0" : "left-0",
            )}
          >
            <div className="rounded-card border border-edge bg-panel/97 p-2 shadow-lift backdrop-blur-xl">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block rounded-[0.5rem] px-4 py-2.5 font-ui text-sm text-fg/85 transition-colors hover:bg-panel-alt hover:text-accent"
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
    <div
      data-surface="dark"
      className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto border-t border-edge bg-page text-fg xl:hidden"
    >
      <Container className="py-6">
        <ul className="space-y-1">
          {primaryNav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="block py-3 font-display text-2xl text-fg"
              >
                {item.label}
              </Link>
              {item.children?.length ? (
                <ul className="mb-3 ml-1 space-y-1 border-l border-edge pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block py-1.5 font-ui text-sm text-fg-muted"
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
