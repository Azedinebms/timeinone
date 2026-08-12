import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type FilterChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children:
    ReactNode;

  active?:
    boolean;
};

export default function FilterChip({
  children,
  active = false,
  className = "",
  ...props
}: FilterChipProps) {
  return (
    <button
      {...props}
      type={
        props.type ??
        "button"
      }
      aria-pressed={
        active
      }
      className={[
        "inline-flex",
        "h-9",
        "items-center",
        "justify-center",
        "rounded-full",
        "border",
        "px-4",
        "text-xs",
        "font-semibold",
        "outline-none",
        "transition",
        "focus-visible:ring-2",
        "focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",

        active
          ? [
              "border-primary-muted",
              "bg-primary-soft",
              "text-primary",
              "shadow-sm",
            ].join(
              " ",
            )
          : [
              "border-border",
              "bg-surface",
              "text-text-secondary",
              "hover:border-primary-muted",
              "hover:bg-primary-soft",
              "hover:text-primary",
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
      {children}
    </button>
  );
}