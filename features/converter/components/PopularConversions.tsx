import Link from "next/link";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import type {
  RelatedConverterLink,
} from "@/services/related-converters.service";

type PopularConversionsProps = {
  fromCity: string;

  toCity: string;

  links:
    RelatedConverterLink[];
};

export default function PopularConversions({
  fromCity,
  toCity,
  links,
}: PopularConversionsProps) {
  if (
    links.length ===
    0
  ) {
    return null;
  }

  return (
    <Card
      as="section"
      variant="default"
      padding="lg"
      className="mt-8"
    >
      <div>
        <Badge
          variant="info"
          size="sm"
        >
          Explore
        </Badge>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
          Popular time conversions
        </h2>

        <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
          Explore other popular time
          conversions related to{" "}
          {fromCity} and {toCity}.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {links.map(
          (
            link,
          ) => (
            <Link
              key={
                link.href
              }
              href={
                link.href
              }
              className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card
                variant="soft"
                padding="md"
                interactive
                className="h-full group-hover:border-primary-muted group-hover:bg-primary-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary transition group-hover:text-primary">
                      {
                        link.label
                      }
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Time converter and
                      meeting planner
                    </p>
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
          ),
        )}
      </div>
    </Card>
  );
}