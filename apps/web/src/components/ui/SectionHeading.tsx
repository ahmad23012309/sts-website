import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <Tag className="text-4xl sm:text-5xl lg:text-[3.25rem]">{title}</Tag>
      <div
        className={cn(
          "rule-gold mt-5 h-px w-24",
          align === "center" && "mx-auto",
        )}
      />
      {description ? (
        <p className="mt-5 text-lg text-muted">{description}</p>
      ) : null}
    </div>
  );
}
