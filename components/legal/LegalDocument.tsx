import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  InstitutionalPage,
} from "@/components/content/InstitutionalPage";

import Card from "@/components/ui/Card";

type LegalDocumentProps = {
  eyebrow: string;

  title: string;

  description: string;

  updatedAt: string;

  children: ReactNode;
};

type LegalSectionProps = {
  id: string;

  number?: string;

  title: string;

  children: ReactNode;
};

type LegalParagraphProps = {
  children: ReactNode;

  className?: string;
};

type LegalListProps = {
  children: ReactNode;
};

type LegalNavigationItem = {
  href: string;

  label: string;
};

type LegalCalloutTone =
  | "blue"
  | "amber"
  | "emerald";

const calloutClasses:
  Record<
    LegalCalloutTone,
    {
      container: string;
      icon: string;
      title: string;
    }
  > = {
  blue: {
    container:
      "border-primary-muted bg-primary-soft",

    icon:
      "border-primary-muted bg-surface text-primary",

    title:
      "text-primary",
  },

  amber: {
    container:
      "border-warning/25 bg-warning-soft",

    icon:
      "border-warning/25 bg-surface text-warning",

    title:
      "text-warning",
  },

  emerald: {
    container:
      "border-success/20 bg-success-soft",

    icon:
      "border-success/20 bg-surface text-success",

    title:
      "text-success",
  },
};

export function LegalDocument({
  eyebrow,
  title,
  description,
  updatedAt,
  children,
}: LegalDocumentProps) {
  return (
    <InstitutionalPage
      eyebrow={eyebrow}
      title={title}
      description={description}
      updatedAt={updatedAt}
      badge="TimeInOne legal information"
    >
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <Card
            variant="default"
            padding="md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Legal pages
            </p>

            <nav
              aria-label="Legal information"
              className="mt-4"
            >
              <ul className="space-y-2">
                {legalNavigation.map(
                  (item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm text-text-secondary outline-none transition hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </Card>

          <Card
            variant="soft"
            padding="sm"
            className="mt-4 border-warning/25 bg-warning-soft"
          >
            <p className="text-xs leading-6 text-text-secondary">
              These pages describe
              the current public
              version of TimeInOne.
              They should be updated
              when new analytics,
              advertising, accounts,
              payments or third-party
              integrations are added.
            </p>
          </Card>
        </aside>

        <article className="min-w-0 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="space-y-0 divide-y divide-border">
            {children}
          </div>
        </article>
      </div>
    </InstitutionalPage>
  );
}

export function LegalSection({
  id,
  number,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 p-5 sm:p-7 lg:p-8"
    >
      <div className="flex items-start gap-4">
        {number && (
          <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft px-2 text-xs font-bold text-primary">
            {number}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
            {title}
          </h2>

          <div className="mt-5 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalParagraph({
  children,
  className = "",
}: LegalParagraphProps) {
  return (
    <p
      className={[
        "text-sm",
        "leading-7",
        "text-text-secondary",
        "sm:text-base",
        className,
      ]
        .filter(
          Boolean,
        )
        .join(
          " ",
        )}
    >
      {children}
    </p>
  );
}

export function LegalList({
  children,
}: LegalListProps) {
  return (
    <ul className="space-y-3 pl-1">
      {children}
    </ul>
  );
}

export function LegalListItem({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3 text-sm leading-7 text-text-secondary sm:text-base">
      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

      <span>{children}</span>
    </li>
  );
}

export function LegalDefinition({
  term,
  children,
}: {
  term: string;

  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-4">
      <dt className="font-semibold text-text-primary">
        {term}
      </dt>

      <dd className="mt-2 text-sm leading-7 text-text-secondary">
        {children}
      </dd>
    </div>
  );
}

export function LegalCallout({
  title,
  children,
  tone = "blue",
}: {
  title: string;

  children: ReactNode;

  tone?:
    LegalCalloutTone;
}) {
  const toneClass =
    calloutClasses[
      tone
    ];

  return (
    <div
      className={[
        "rounded-2xl",
        "border",
        "p-5",
        toneClass.container,
      ].join(
        " ",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={[
            "flex",
            "h-8",
            "w-8",
            "shrink-0",
            "items-center",
            "justify-center",
            "rounded-lg",
            "border",
            "text-sm",
            "font-bold",
            toneClass.icon,
          ].join(
            " ",
          )}
        >
          !
        </span>

        <div>
          <p
            className={[
              "font-semibold",
              toneClass.title,
            ].join(
              " ",
            )}
          >
            {title}
          </p>

          <div className="mt-2 text-sm leading-7 text-text-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const legalNavigation:
  LegalNavigationItem[] = [
  {
    href:
      "/privacy-policy",

    label:
      "Privacy Policy",
  },
  {
    href:
      "/terms-of-use",

    label:
      "Terms of Use",
  },
  {
    href:
      "/cookie-policy",

    label:
      "Cookie Policy",
  },
  {
    href:
      "/legal-notice",

    label:
      "Legal Notice",
  },
];