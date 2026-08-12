import type {
  ChangeEvent,
  InputHTMLAttributes,
} from "react";

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "value"
  | "onChange"
> & {
  value: string;

  onValueChange: (
    value: string,
  ) => void;

  label?: string;

  containerClassName?: string;
};

export default function SearchInput({
  value,
  onValueChange,
  label,
  placeholder =
    "Search...",
  containerClassName =
    "",
  className =
    "",
  ...props
}: SearchInputProps) {
  function handleChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ): void {
    onValueChange(
      event.target.value,
    );
  }

  return (
    <label
      className={[
        "block",
        containerClassName,
      ]
        .filter(
          Boolean,
        )
        .join(
          " ",
        )}
    >
      {label && (
        <span className="mb-2 block text-sm font-semibold text-text-primary">
          {label}
        </span>
      )}

      <span className="relative block">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-none text-text-muted"
        >
          ⌕
        </span>

        <input
          {...props}
          type="search"
          value={value}
          onChange={
            handleChange
          }
          placeholder={
            placeholder
          }
          className={[
            "h-12",
            "w-full",
            "rounded-xl",
            "border",
            "border-border",
            "bg-surface",
            "pl-11",
            "pr-11",
            "text-sm",
            "text-text-primary",
            "shadow-sm",
            "outline-none",
            "transition",
            "placeholder:text-text-subtle",
            "hover:border-border-strong",
            "focus:border-primary",
            "focus:ring-2",
            "focus:ring-primary/15",
            className,
          ]
            .filter(
              Boolean,
            )
            .join(
              " ",
            )}
        />

        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onValueChange(
                "",
              );
            }}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted outline-none transition hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span
              aria-hidden="true"
            >
              ×
            </span>
          </button>
        )}
      </span>
    </label>
  );
}