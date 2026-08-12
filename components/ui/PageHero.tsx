import Link from "next/link";

type PageHeroBreadcrumb = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  badge: string;

  title: string;

  highlight?: string;

  description: string;

  breadcrumbs?: PageHeroBreadcrumb[];

  tags?: string[];

  className?: string;
};

export default function PageHero({
  badge,
  title,
  highlight,
  description,
  breadcrumbs = [],
  tags = [],
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={[
        "border-b",
        "border-border",
        "bg-gradient-to-b",
        "from-primary-soft/70",
        "via-background",
        "to-background",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-6 sm:py-9 lg:px-8">
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-text-muted"
          >
            {breadcrumbs.map(
              (
                breadcrumb,
                index,
              ) => {
                const isLast =
                  index ===
                  breadcrumbs.length - 1;

                return (
                  <div
                    key={`${breadcrumb.label}-${index}`}
                    className="flex items-center gap-2"
                  >
                    {breadcrumb.href &&
                    !isLast ? (
                      <Link
                        href={
                          breadcrumb.href
                        }
                        className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                      >
                        {
                          breadcrumb.label
                        }
                      </Link>
                    ) : (
                      <span
                        aria-current={
                          isLast
                            ? "page"
                            : undefined
                        }
                        className={
                          isLast
                            ? "font-medium text-text-secondary"
                            : ""
                        }
                      >
                        {
                          breadcrumb.label
                        }
                      </span>
                    )}

                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="text-text-subtle"
                      >
                        /
                      </span>
                    )}
                  </div>
                );
              },
            )}
          </nav>
        )}

        <div
          className={[
            "flex",
            "flex-col",
            "gap-5",
            "lg:flex-row",
            "lg:items-end",
            "lg:justify-between",

            breadcrumbs.length > 0
              ? "mt-7"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              {badge}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {title}

              {highlight && (
                <>
                  {" "}

                  <span className="text-primary">
                    {highlight}
                  </span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              {description}
            </p>
          </div>

          {tags.length > 0 && (
            <div className="flex max-w-xl flex-wrap gap-2 lg:justify-end">
              {tags.map(
                (
                  tag,
                ) => (
                  <span
                    key={
                      tag
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />

                    {tag}
                  </span>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}