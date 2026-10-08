import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-ui font-semibold tracking-wide uppercase transition-[background-color,border-color,color,transform] duration-200 rounded-pill disabled:opacity-50 disabled:pointer-events-none active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-yellow text-ink hover:bg-yellow-dark shadow-[0_6px_20px_-8px_rgba(255,199,44,0.7)]",
  outline:
    "border border-gold/60 text-gold hover:border-gold hover:bg-gold/10",
  ghost: "text-text hover:text-yellow",
  whatsapp: "bg-whatsapp text-ink hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-11 px-6 text-xs",
  lg: "h-13 px-8 text-sm",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:");
  const classes = cn(base, variants[variant], sizes[size], className);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        target={href.startsWith("http") ? "_blank" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
