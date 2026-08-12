import type {
  ReactNode,
} from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type TimezoneSectionProps = {
  badge:
    string;

  badgeVariant?:
    "primary"
    | "info"
    | "success"
    | "warning"
    | "accent"
    | "neutral";

  title:
    string;

  description?:
    string;

  children:
    ReactNode;

  className?:
    string;
};

export default function TimezoneSection({
  badge,
  badgeVariant = "primary",
  title,
  description,
  children,
  className = "",
}: TimezoneSectionProps) {
  return (
    <Card
      as="section"
      variant="default"
      padding="lg"
      className={[
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <Badge
          variant={
            badgeVariant
          }
          size="sm"
        >
          {badge}
        </Badge>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
            {description}
          </p>
        )}
      </div>

      <div className="mt-8">
        {children}
      </div>
    </Card>
  );
}