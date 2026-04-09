interface PageHeroProps {
  badge: string;
  title: string;
  highlight?: string;
  suffix?: string;
  description: string;
}

export function PageHero({ badge, title, highlight, suffix, description }: PageHeroProps) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden">
      {/* Perspective Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="perspective-grid" />
      </div>

      {/* Mesh Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="mesh-glow mesh-glow-center" />
        <div className="mesh-glow mesh-glow-accent" />
      </div>

      <div className="absolute inset-0 dot-grid opacity-[0.18] dark:opacity-[0.10] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28 text-center">
        <p className="hero-badge inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
          {badge}
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          {highlight ? (
            <>
              {title}{" "}
              <span className="hero-highlight">{highlight}</span>
              {suffix}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground whitespace-pre-line">
          {description}
        </p>
      </div>
    </section>
  );
}
