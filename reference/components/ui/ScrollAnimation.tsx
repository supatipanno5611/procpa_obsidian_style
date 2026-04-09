"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "slide-up" | "scale-up";
  delay?: number; // ms
  duration?: number; // ms
}

export function ScrollAnimation({
  children,
  className,
  animation = "fade-in",
  delay = 0,
  duration = 700,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before fully in view
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in":
        return "opacity-0 translate-y-4"; // Start state
      case "slide-up":
        return "opacity-0 translate-y-8";
      case "scale-up":
        return "opacity-0 scale-95";
      default:
        return "opacity-0";
    }
  };

  const getVisibleClass = () => {
    switch (animation) {
      case "fade-in":
      case "slide-up":
        return "opacity-100 translate-y-0"; // End state
      case "scale-up":
        return "opacity-100 scale-100";
      default:
        return "opacity-100";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? getVisibleClass() : getAnimationClass(),
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
