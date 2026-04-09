import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
  icon?: React.ElementType;
}

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
  icon: Icon,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mb-6",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        className
      )}
    >
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl flex items-center gap-2.5">
        {Icon && <Icon className="w-6 h-6 text-primary shrink-0" />}
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground whitespace-pre-wrap">
          {description}
        </p>
      )}
    </div>
  );
}
