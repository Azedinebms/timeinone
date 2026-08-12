import type {
  ReactNode,
} from "react";

type ResultCardVariant =
  | "default"
  | "highlighted";

type ResultCardProps = {
  city: string;

  time: string;

  date: string;

  timezone: string;

  variant?:
    ResultCardVariant;

  footer?: ReactNode;
};

const variantClasses:
  Record<
    ResultCardVariant,
    {
      container: string;
      city: string;
      time: string;
      date: string;
      timezone: string;
    }
  > = {
  default: {
    container:
      "border-border bg-surface",

    city:
      "text-text-secondary",

    time:
      "text-text-primary",

    date:
      "text-text-secondary",

    timezone:
      "text-text-muted",
  },

  highlighted: {
    container:
      "border-primary-muted bg-primary-soft",

    city:
      "text-primary",

    time:
      "text-text-primary",

    date:
      "text-text-secondary",

    timezone:
      "text-text-muted",
  },
};

export default function ResultCard({
  city,
  time,
  date,
  timezone,
  variant = "default",
  footer,
}: ResultCardProps) {
  const classes =
    variantClasses[
      variant
    ];

  return (
    <article
      className={[
        "relative",
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "p-6",
        "shadow-sm",
        "transition",
        "hover:-translate-y-0.5",
        "hover:shadow-md",
        classes.container,
      ].join(
        " ",
      )}
    >
      {variant ===
        "highlighted" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-primary-muted/60 blur-3xl"
        />
      )}

      <div className="relative">
        <p
          className={[
            "text-sm",
            "font-semibold",
            classes.city,
          ].join(
            " ",
          )}
        >
          {city}
        </p>

        <p
          className={[
            "mt-2",
            "text-4xl",
            "font-bold",
            "tracking-tight",
            "tabular-nums",
            classes.time,
          ].join(
            " ",
          )}
        >
          {time}
        </p>

        <p
          className={[
            "mt-2",
            "text-sm",
            classes.date,
          ].join(
            " ",
          )}
        >
          {date}
        </p>

        <p
          className={[
            "mt-4",
            "text-xs",
            "font-medium",
            classes.timezone,
          ].join(
            " ",
          )}
        >
          {timezone}
        </p>

        {footer && (
          <div className="mt-5 border-t border-border pt-4">
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}