"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DomainMeta } from "@/lib/taxonomy";

const DOMAIN_THEMES: Record<
  string,
  { accent: string; bg: string; text: string; border: string; glow: string; tabActive: string }
> = {
  business: {
    accent: "bg-blue-500",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    tabActive: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
  tech: {
    accent: "bg-indigo-500",
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
    border: "border-indigo-500",
    glow: "shadow-[0_0_40px_rgba(99,102,241,0.15)]",
    tabActive: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  },
};

function getTheme(domainKey: string) {
  return DOMAIN_THEMES[domainKey] ?? DOMAIN_THEMES.business!;
}

function DomainSection({ domain }: { domain: DomainMeta }) {
  const theme = getTheme(domain.key);
  const topics = domain.topics ?? [];

  return (
    <div className="relative w-full flex flex-col items-center py-16">
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 opacity-40",
          theme.bg
        )}
      />

      <div className="w-full max-w-5xl flex flex-col items-center relative">
        <Link
          href={`/${domain.key}`}
          className="flex flex-col items-center group transition-transform hover:-translate-y-1 z-10"
        >
          <div className={cn("px-8 py-6 rounded-2xl bg-card border-2 shadow-sm flex flex-col items-center text-center max-w-xs w-full mx-auto transition-shadow duration-300", theme.border, theme.glow)}>
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg", theme.accent)}>
              <span className="material-symbols-outlined text-[28px]">{domain.icon}</span>
            </div>
            <h2 className="text-2xl font-black mb-1">{domain.label}</h2>
            {domain.labelEn && <p className="text-muted-foreground text-xs">{domain.labelEn}</p>}
          </div>
        </Link>

        {topics.length > 0 && (
          <>
            <div className={cn("h-10 w-px", theme.bg)} />
            <div className="w-3/4 h-px bg-border/60 relative" />

            <div className="w-full mt-6 flex justify-center flex-wrap gap-x-8 gap-y-10 text-center">
              {topics.map((topic) => {
                const hasSubs = topic.subtopics && topic.subtopics.length > 0;
                return (
                  <div key={topic.key} className="flex flex-col items-center w-48">
                    <div className="w-px h-5 bg-border/60" />

                    <Link
                      href={`/${domain.key}/${topic.key}`}
                      className="bg-card border rounded-xl py-4 px-5 flex flex-col items-center w-full hover:shadow-md transition-all hover:-translate-y-0.5 group"
                    >
                      {topic.icon && (
                        <span className={cn("material-symbols-outlined text-[20px] mb-2", theme.text)}>
                          {topic.icon}
                        </span>
                      )}
                      <div className="text-base font-bold">{topic.label}</div>
                      {topic.labelEn && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">{topic.labelEn}</div>
                      )}
                    </Link>

                    {hasSubs && (
                      <div className="flex flex-col items-center mt-3 w-full">
                        <div className="w-px h-4 bg-border/40" />
                        <div className="flex flex-wrap justify-center gap-2">
                          {topic.subtopics.map((sub) => (
                            <Link
                              key={sub.key}
                              href={`/${domain.key}/${topic.key}/${sub.key}`}
                              className="text-[11px] py-1.5 px-3 rounded-lg border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-border transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function TopicTree({ domains }: { domains: DomainMeta[] }) {
  const [activeDomain, setActiveDomain] = useState<string>(domains[0]?.key ?? "business");

  const selected = domains.find((d) => d.key === activeDomain) ?? domains[0];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {domains.map((domain) => {
          const theme = getTheme(domain.key);
          const isActive = activeDomain === domain.key;
          return (
            <button
              key={domain.key}
              onClick={() => setActiveDomain(domain.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                isActive
                  ? theme.tabActive
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <span className="material-symbols-outlined text-[16px]">{domain.icon}</span>
              {domain.label}
            </button>
          );
        })}
      </div>

      <div className="w-full">
        {selected && <DomainSection key={selected.key} domain={selected} />}
      </div>
    </div>
  );
}
