import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "accent";

type BadgeSize =
  | "sm"
  | "md";

type BadgeProps<
  TElement extends ElementType,
> = {
  as?: TElement;

  children:
    ReactNode;

  variant?:
    BadgeVariant;

  size?:
    BadgeSize;

  dot?:
    boolean;

  className?:
    string;
} & Omit<
  ComponentPropsWithoutRef<TElement>,
  | "as"
  | "children"
  | "className"
>;

const variantClasses:
  Record<
    BadgeVariant,
    string
  > = {
  primary:
    "border-primary-muted bg-primary-soft text-primary",

  success:
    "border-success/20 bg-success-soft text-success",

  warning:
    "border-warning/25 bg-warning-soft text-warning",

  danger:
    "border-danger/20 bg-danger-soft text-danger",

  info:
    "border-info/20 bg-info-soft text-info",

  neutral:
    "border-border bg-surface-soft text-text-secondary",

  accent:
    "border-accent/20 bg-accent-soft text-accent",
};

const dotClasses:
  Record<
    BadgeVariant,
    string
  > = {
  primary:
    "bg-primary",

  success:
    "bg-success",

  warning:
    "bg-warning",

  danger:
    "bg-danger",

  info:
    "bg-info",

  neutral:
    "bg-text-muted",

  accent:
    "bg-accent",
};

const sizeClasses:
  Record<
    BadgeSize,
    string
  > = {
  sm:
    "gap-1.5 px-2.5 py-1 text-[11px]",

  md:
    "gap-2 px-3 py-1.5 text-xs",
};

export default function Badge<
  TElement extends ElementType =
    "span",
>({
  as,
  children,
  variant = "primary",
  size = "md",
  dot = false,
  className = "",
  ...props
}: BadgeProps<TElement>) {
  const Component =
    as ??
    "span";

  return (
    <Component
      className={[
        "inline-flex",
        "w-fit",
        "items-center",
        "rounded-full",
        "border",
        "font-semibold",
        "leading-none",
        "whitespace-nowrap",

        variantClasses[
          variant
        ],

        sizeClasses[
          size
        ],

        className,
      ]
        .filter(
          Boolean,
        )
        .join(
          " ",
        )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={[
            "h-1.5",
            "w-1.5",
            "shrink-0",
            "rounded-full",

            dotClasses[
              variant
            ],
          ].join(
            " ",
          )}
        />
      )}

      {children}
    </Component>
  );
}