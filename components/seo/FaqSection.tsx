import type {
  FaqItem,
} from "@/lib/seo";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type FaqSectionProps = {
  title?: string;
  description?: string;
  items: FaqItem[];
};

export default function FaqSection({
  title = "Frequently asked questions",
  description,
  items,
}: FaqSectionProps) {
  return (
    <Card
      as="section"
      variant="default"
      padding="lg"
      className="mt-8"
    >
      <div>
        <Badge
          variant="primary"
          size="sm"
        >
          FAQ
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

      <div className="mt-8 divide-y divide-border">
        {items.map((item) => (
          <details
            key={item.question}
            className="group py-5 first:pt-0 last:pb-0"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-lg font-semibold text-text-primary outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary">
              <span>
                {item.question}
              </span>

              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-xl text-primary transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>

            <p className="mt-4 max-w-4xl leading-7 text-text-secondary">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Card>
  );
}