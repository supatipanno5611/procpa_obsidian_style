import { cn } from "@/lib/utils";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import Link from "next/link";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  onClick,
  href,
  delay = 0,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  delay?: number;
}) => {
  const Content = () => (
    <div onClick={onClick} className="h-full flex flex-col justify-between">
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200 mt-4">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );

  const wrapperClasses = cn(
    "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
    (onClick || href) && "cursor-pointer",
    className
  );

  return (
    <ScrollAnimation animation="scale-up" delay={delay} className={wrapperClasses}>
      {href ? (
        <Link href={href} className="h-full flex flex-col">
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </ScrollAnimation>
  );
};
