import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

type CardVariant =
  | "default"
  | "soft"
  | "elevated";

type CardPadding =
  | "none"
  | "sm"
  | "md"
  | "lg";

type CardProps<
  TElement extends ElementType,
> = {
  as?: TElement;

  children:
    ReactNode;

  variant?:
    CardVariant;

  padding?:
    CardPadding;

  interactive?:
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
    CardVariant,
    string
  > = {
  default:
    "border border-border bg-surface shadow-sm",

  soft:
    "border border-border-soft bg-surface-soft",

  elevated:
    "border border-border-soft bg-surface-elevated shadow-md",
};

const paddingClasses:
  Record<
    CardPadding,
    string
  > = {
  none:
    "",

  sm:
    "p-4",

  md:
    "p-5 sm:p-6",

  lg:
    "p-6 sm:p-8",
};

export default function Card<
  TElement extends ElementType =
    "div",
>({
  as,
  children,
  variant = "default",
  padding = "md",
  interactive = false,
  className = "",
  ...props
}: CardProps<TElement>) {
  const Component =
    as ??
    "div";

  return (
    <Component
      className={[
        "rounded-2xl",
        "transition",
        "duration-200",

        variantClasses[
          variant
        ],

        paddingClasses[
          padding
        ],

        interactive
          ? [
              "hover:-translate-y-0.5",
              "hover:border-primary-muted",
              "hover:shadow-md",
            ].join(
              " ",
            )
          : "",

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
      {children}
    </Component>
  );
}