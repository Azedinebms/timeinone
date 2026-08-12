import type {
  ReactNode,
} from "react";

import Card from "@/components/ui/Card";

type ConverterCardProps = {
  children:
    ReactNode;

  className?:
    string;
};

export default function ConverterCard({
  children,
  className = "",
}: ConverterCardProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      className={[
        "relative",
        "overflow-visible",
        "border-border",
        "bg-surface",
        "shadow-lg",
        "transition-all",
        "duration-300",
        "hover:-translate-y-0.5",
        "hover:shadow-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 -top-px h-px bg-gradient-to-r from-transparent via-primary-muted to-transparent"
      />

      {children}
    </Card>
  );
}