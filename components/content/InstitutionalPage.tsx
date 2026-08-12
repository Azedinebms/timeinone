import type {
  ReactNode,
} from "react";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type InstitutionalPageProps = {
  eyebrow: string;

  title: string;

  description: string;

  children: ReactNode;

  updatedAt?: string;

  badge?: string;
};

type InstitutionalSectionProps = {
  id?: string;

  eyebrow?: string;

  title: string;

  description?: string;

  children: ReactNode;

  className?: string;
};

type InstitutionalCardProps = {
  icon?: string;

  title: string;

  description: string;

  children?: ReactNode;

  className?: string;
};

type InstitutionalLinkCardProps = {
  href: string;

  icon?: string;

  title: string;

  description: string;

  linkLabel: string;
};

type InstitutionalCalloutProps = {
  title: string;

  description: string;

  children?: ReactNode;
};

export function InstitutionalPage({
  eyebrow,
  title,
  description,
  children,
  updatedAt,
  badge,
}: InstitutionalPageProps) {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary-soft blur-3xl" />

          <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-accent-soft opacity-80 blur-3xl" />

          <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-info-soft opacity-80 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge
                  variant="primary"
                  size="md"
                  dot
                >
                  {badge}
                </Badge>
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
              {description}
            </p>

            {updatedAt && (
              <p className="mt-6 text-xs text-text-muted">
                Last updated: {updatedAt}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {children}
      </div>
    </main>
  );
}

export function InstitutionalSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: InstitutionalSectionProps) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-24",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-4 text-base leading-8 text-text-secondary">
            {description}
          </p>
        )}
      </div>

      <div className="mt-7">
        {children}
      </div>
    </section>
  );
}

export function InstitutionalCard({
  icon,
  title,
  description,
  children,
  className = "",
}: InstitutionalCardProps) {
  return (
    <Card
      as="article"
      variant="default"
      padding="md"
      interactive
      className={className}
    >
      {icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-lg text-primary">
          {icon}
        </span>
      )}

      <h3
        className={
          icon
            ? "mt-5 text-lg font-semibold text-text-primary"
            : "text-lg font-semibold text-text-primary"
        }
      >
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-text-secondary">
        {description}
      </p>

      {children && (
        <div className="mt-5">
          {children}
        </div>
      )}
    </Card>
  );
}

export function InstitutionalLinkCard({
  href,
  icon,
  title,
  description,
  linkLabel,
}: InstitutionalLinkCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card
        variant="default"
        padding="md"
        interactive
        className="h-full group-hover:border-primary-muted"
      >
        {icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-lg text-primary transition group-hover:border-primary group-hover:bg-primary-muted">
            {icon}
          </span>
        )}

        <h3 className="mt-5 text-lg font-semibold text-text-primary">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-text-secondary">
          {description}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-hover">
          {linkLabel}

          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </Card>
    </Link>
  );
}

export function InstitutionalCallout({
  title,
  description,
  children,
}: InstitutionalCalloutProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary-muted bg-surface p-6 shadow-md sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-soft blur-3xl" />

        <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-accent-soft blur-3xl" />
      </div>

      <div className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          TimeInOne
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h2>

        <p className="mt-4 text-base leading-8 text-text-secondary">
          {description}
        </p>

        {children && (
          <div className="mt-6 flex flex-wrap gap-3">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}