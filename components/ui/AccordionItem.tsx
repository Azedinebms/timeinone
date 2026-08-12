import type {
  ReactNode,
} from "react";

type AccordionItemProps = {
  id: string;

  title:
    ReactNode;

  eyebrow?:
    ReactNode;

  prefix?:
    ReactNode;

  children:
    ReactNode;

  open:
    boolean;

  onToggle:
    () => void;

  className?:
    string;
};

export default function AccordionItem({
  id,
  title,
  eyebrow,
  prefix,
  children,
  open,
  onToggle,
  className = "",
}: AccordionItemProps) {
  const buttonId =
    `${id}-button`;

  const panelId =
    `${id}-panel`;

  return (
    <article
      className={[
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "bg-surface",
        "transition-all",
        "duration-200",

        open
          ? [
              "border-primary-muted",
              "shadow-md",
            ].join(
              " ",
            )
          : [
              "border-border",
              "shadow-sm",
              "hover:border-primary-muted",
              "hover:shadow-md",
            ].join(
              " ",
            ),

        className,
      ]
        .filter(
          Boolean,
        )
        .join(
          " ",
        )}
    >
      <h2>
        <button
          id={buttonId}
          type="button"
          aria-expanded={
            open
          }
          aria-controls={
            panelId
          }
          onClick={
            onToggle
          }
          className="flex w-full items-start gap-4 px-5 py-5 text-left outline-none transition hover:bg-surface-soft focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-6"
        >
          {prefix && (
            <span
              className={[
                "flex",
                "h-9",
                "w-9",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-xl",
                "border",
                "text-xs",
                "font-bold",
                "tabular-nums",
                "transition",

                open
                  ? [
                      "border-primary-muted",
                      "bg-primary-soft",
                      "text-primary",
                    ].join(
                      " ",
                    )
                  : [
                      "border-border",
                      "bg-surface-soft",
                      "text-text-muted",
                    ].join(
                      " ",
                    ),
              ].join(
                " ",
              )}
            >
              {prefix}
            </span>
          )}

          <span className="min-w-0 flex-1">
            {eyebrow && (
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                {eyebrow}
              </span>
            )}

            <span className="mt-1 block text-base font-semibold leading-7 text-text-primary">
              {title}
            </span>
          </span>

          <span
            aria-hidden="true"
            className={[
              "mt-1",
              "flex",
              "h-8",
              "w-8",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-full",
              "border",
              "border-border",
              "bg-surface",
              "text-lg",
              "text-text-secondary",
              "transition-all",
              "duration-200",

              open
                ? [
                    "rotate-45",
                    "border-primary-muted",
                    "bg-primary-soft",
                    "text-primary",
                  ].join(
                    " ",
                  )
                : "",
            ].join(
              " ",
            )}
          >
            +
          </span>
        </button>
      </h2>

      <div
        id={panelId}
        role="region"
        aria-labelledby={
          buttonId
        }
        hidden={
          !open
        }
        className="border-t border-border bg-surface-soft px-5 py-5 sm:px-6"
      >
        {children}
      </div>
    </article>
  );
}