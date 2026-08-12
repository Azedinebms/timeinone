import Link from "next/link";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import type {
  TimezoneDefinition,
} from "@/lib/timezones";

type TimezoneCardProps = {
  timezone:
    TimezoneDefinition;
};

export default function TimezoneCard({
  timezone,
}: TimezoneCardProps) {
  return (
    <Link
      href={
        `/timezone/${timezone.slug}`
      }
      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card
        variant="default"
        padding="md"
        interactive
        className="h-full group-hover:border-primary-muted"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xl font-bold text-text-primary transition group-hover:text-primary">
              {
                timezone.abbreviation
              }
            </p>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {
                timezone.name
              }
            </p>
          </div>

          <span
            aria-hidden="true"
            className="shrink-0 text-lg text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary"
          >
            →
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge
            variant="neutral"
            size="sm"
          >
            {timezone.kind ===
            "fixed"
              ? "Fixed offset"
              : "Seasonal zone"}
          </Badge>

          {timezone.observesDst && (
            <Badge
              variant="accent"
              size="sm"
            >
              DST
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}