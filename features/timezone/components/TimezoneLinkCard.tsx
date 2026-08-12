import Link from "next/link";

import Card from "@/components/ui/Card";

type TimezoneLinkCardProps = {
  href:
    string;

  title:
    string;

  description?:
    string;

  highlighted?:
    boolean;

  compact?:
    boolean;
};

export default function TimezoneLinkCard({
  href,
  title,
  description,
  highlighted = false,
  compact = false,
}: TimezoneLinkCardProps) {
  return (
    <Link
      href={
        href
      }
      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card
        variant={
          highlighted
            ? "soft"
            : "default"
        }
        padding={
          compact
            ? "sm"
            : "md"
        }
        interactive
        className={[
          "h-full",

          highlighted
            ? "border-primary-muted bg-primary-soft"
            : "group-hover:border-primary-muted",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex h-full items-center justify-between gap-4">
          <div className="min-w-0">
            <p
              className={[
                "font-semibold",
                "text-text-primary",
                "transition",
                "group-hover:text-primary",

                compact
                  ? "text-base"
                  : "text-lg",
              ].join(" ")}
            >
              {title}
            </p>

            {description && (
              <p className="mt-1 text-sm leading-6 text-text-muted">
                {description}
              </p>
            )}
          </div>

          <span
            aria-hidden="true"
            className="shrink-0 text-lg text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary"
          >
            →
          </span>
        </div>
      </Card>
    </Link>
  );
}