import type {
  ReactNode,
} from "react";

import Badge from "@/components/ui/Badge";

type HeroSectionProps = {
  badge?: string;

  title: ReactNode;

  description?: ReactNode;

  children?: ReactNode;

  className?: string;

  contentClassName?: string;
};

export default function HeroSection({
  badge,
  title,
  description,
  children,
  className = "",
  contentClassName = "",
}: HeroSectionProps) {
  return (
    <section
      className={[
        "relative",
        "overflow-hidden",
        "border-b",
        "border-border",
        "bg-surface",
        className,
      ]
        .filter(
          Boolean,
        )
        .join(
          " ",
        )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-[-260px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary-soft blur-3xl" />

        <div className="absolute -left-48 top-28 h-80 w-80 rounded-full bg-accent-soft opacity-80 blur-3xl" />

        <div className="absolute -right-48 top-20 h-80 w-80 rounded-full bg-info-soft opacity-80 blur-3xl" />
      </div>

      <div
        className={[
          "relative",
          "mx-auto",
          "max-w-6xl",
          "px-5",
          "py-16",
          "sm:px-6",
          "sm:py-20",
          "lg:px-8",
          "lg:py-24",
          contentClassName,
        ]
          .filter(
            Boolean,
          )
          .join(
            " ",
          )}
      >
        <header className="mx-auto max-w-4xl text-center">
          {badge && (
            <div className="flex justify-center">
              <Badge
                variant="primary"
                size="md"
                dot
              >
                {badge}
              </Badge>
            </div>
          )}

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
              {description}
            </p>
          )}

          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </header>
      </div>
    </section>
  );
}