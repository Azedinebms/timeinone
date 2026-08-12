"use client";

type MeetingShareButtonProps = {
  copied: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function MeetingShareButton({
  copied,
  disabled = false,
  onClick,
}: MeetingShareButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex",
        "h-11",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-xl",
        "border",
        "border-slate-200",
        "bg-white",
        "px-5",
        "text-sm",
        "font-semibold",
        "text-slate-700",
        "shadow-sm",
        "transition-all",
        "duration-200",
        "hover:-translate-y-0.5",
        "hover:border-blue-500",
        "hover:bg-blue-50",
        "hover:text-blue-600",
        "hover:shadow-md",
        "disabled:cursor-not-allowed",
        "disabled:border-slate-200",
        "disabled:bg-slate-100",
        "disabled:text-slate-400",
      ].join(" ")}
    >
      <span
        className={[
          "flex",
          "h-6",
          "w-6",
          "items-center",
          "justify-center",
          "rounded-full",
          copied
            ? "bg-emerald-100 text-emerald-600"
            : "bg-blue-100 text-blue-600",
        ].join(" ")}
        aria-hidden="true"
      >
        {copied ? "✓" : "↗"}
      </span>

      <span>
        {copied ? "Planner link copied" : "Share planner"}
      </span>
    </button>
  );
}