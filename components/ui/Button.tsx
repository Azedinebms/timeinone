import type {
  ComponentPropsWithoutRef,
  ElementType,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";

type Size =
  | "sm"
  | "md"
  | "lg";

type ButtonProps<
  TElement extends ElementType,
> = {
  as?: TElement;

  variant?: Variant;

  size?: Size;

  className?: string;
} & Omit<
  ComponentPropsWithoutRef<TElement>,
  "as" | "className"
>;

const variants: Record<
  Variant,
  string
> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm",

  secondary:
    "bg-surface border border-border text-text-primary hover:border-primary-muted",

  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary-soft",

  ghost:
    "text-text-secondary hover:bg-surface-soft hover:text-text-primary",
};

const sizes: Record<
  Size,
  string
> = {
  sm:
    "h-9 px-4 text-sm",

  md:
    "h-11 px-5 text-sm",

  lg:
    "h-12 px-6 text-base",
};

export default function Button<
  TElement extends ElementType =
    "button",
>({
  as,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps<TElement>) {
  const Component =
    as ??
    "button";

  return (
    <Component
      className={[
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-xl",
        "font-semibold",
        "transition-all",
        "duration-200",
        "outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",

        variants[
          variant
        ],

        sizes[size],

        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}