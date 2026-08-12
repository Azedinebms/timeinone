"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastVariant =
  | "success"
  | "error"
  | "info"
  | "warning";

export type ToastInput = {
  title: string;

  description?: string;

  variant?: ToastVariant;

  duration?: number;

  actionLabel?: string;

  onAction?: () => void;
};

export type ToastItem =
  ToastInput & {
    id: string;

    variant: ToastVariant;
    duration: number;
  };

export type ToastContextValue = {
  toast: (
    input: ToastInput,
  ) => string;

  success: (
    title: string,
    description?: string,
  ) => string;

  error: (
    title: string,
    description?: string,
  ) => string;

  info: (
    title: string,
    description?: string,
  ) => string;

  warning: (
    title: string,
    description?: string,
  ) => string;

  dismiss: (
    toastId: string,
  ) => void;

  dismissAll:
    () => void;
};

export const ToastContext =
  createContext<
    ToastContextValue | null
  >(null);

const DEFAULT_DURATION =
  3_000;

const MAX_VISIBLE_TOASTS =
  4;

function createToastId():
  string {
  if (
    typeof crypto !==
      "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return [
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}

function getToastIcon(
  variant: ToastVariant,
): string {
  switch (variant) {
    case "success":
      return "✓";

    case "error":
      return "!";

    case "warning":
      return "!";

    case "info":
      return "i";
  }
}

function getToastClasses(
  variant: ToastVariant,
): {
  container: string;
  icon: string;
} {
  switch (variant) {
    case "success":
      return {
        container:
          "border-emerald-500/30 bg-emerald-950/95",

        icon:
          "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
      };

    case "error":
      return {
        container:
          "border-red-500/30 bg-red-950/95",

        icon:
          "border-red-400/30 bg-red-500/15 text-red-300",
      };

    case "warning":
      return {
        container:
          "border-amber-500/30 bg-amber-950/95",

        icon:
          "border-amber-400/30 bg-amber-500/15 text-amber-300",
      };

    case "info":
      return {
        container:
          "border-blue-500/30 bg-blue-950/95",

        icon:
          "border-blue-400/30 bg-blue-500/15 text-blue-300",
      };
  }
}

type ToastCardProps = {
  item: ToastItem;

  onDismiss: (
    toastId: string,
  ) => void;
};

function ToastCard({
  item,
  onDismiss,
}: ToastCardProps) {
  const classes =
    getToastClasses(
      item.variant,
    );

  return (
    <div
      role={
        item.variant === "error"
          ? "alert"
          : "status"
      }
      aria-live={
        item.variant === "error"
          ? "assertive"
          : "polite"
      }
      className={[
        "pointer-events-auto",
        "relative",
        "w-full",
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "shadow-2xl",
        "shadow-black/40",
        "backdrop-blur-xl",
        "animate-[atlas-toast-in_220ms_ease-out]",
        classes.container,
      ].join(" ")}
    >
      <div className="flex items-start gap-3 p-4 pr-12">
        <span
          aria-hidden="true"
          className={[
            "flex",
            "h-9",
            "w-9",
            "shrink-0",
            "items-center",
            "justify-center",
            "rounded-xl",
            "border",
            "text-sm",
            "font-bold",
            classes.icon,
          ].join(" ")}
        >
          {getToastIcon(
            item.variant,
          )}
        </span>

            <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">
                {item.title}
            </p>

            {item.description && (
                <p className="mt-1 text-sm leading-5 text-slate-300">
                {item.description}
                </p>
            )}

            {item.actionLabel &&
                item.onAction && (
                <button
                    type="button"
                    onClick={() => {
                    item.onAction?.();

                    onDismiss(
                        item.id,
                    );
                    }}
                    className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/15"
                >
                    {item.actionLabel}
                </button>
                )}
            </div>
      </div>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => {
          onDismiss(
            item.id,
          );
        }}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        ×
      </button>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/30"
        style={{
          animation:
            `atlas-toast-progress ${item.duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

type ToastProviderProps = {
  children: ReactNode;
};

export default function ToastProvider({
  children,
}: ToastProviderProps) {
  const [
    toasts,
    setToasts,
  ] = useState<
    ToastItem[]
  >([]);

  const timersRef =
    useRef<
      Map<string, number>
    >(
      new Map(),
    );

  const dismiss =
    useCallback(
      (
        toastId: string,
      ) => {
        const timer =
          timersRef.current.get(
            toastId,
          );

        if (
          timer !==
          undefined
        ) {
          window.clearTimeout(
            timer,
          );

          timersRef.current.delete(
            toastId,
          );
        }

        setToasts(
          (
            currentToasts,
          ) =>
            currentToasts.filter(
              (toastItem) =>
                toastItem.id !==
                toastId,
            ),
        );
      },
      [],
    );

  const dismissAll =
    useCallback(() => {
      for (
        const timer
        of timersRef.current.values()
      ) {
        window.clearTimeout(
          timer,
        );
      }

      timersRef.current.clear();

      setToasts([]);
    }, []);

  const toast =
    useCallback(
      (
        input: ToastInput,
      ): string => {
        const id =
          createToastId();

        const duration =
          typeof input.duration ===
            "number" &&
          Number.isFinite(
            input.duration,
          )
            ? Math.max(
                1_000,
                Math.floor(
                  input.duration,
                ),
              )
            : DEFAULT_DURATION;

        const toastItem:
          ToastItem = {
          ...input,

          id,

          duration,

          variant:
            input.variant ??
            "info",
        };

        setToasts(
          (
            currentToasts,
          ) => [
            toastItem,

            ...currentToasts,
          ].slice(
            0,
            MAX_VISIBLE_TOASTS,
          ),
        );

        const timer =
          window.setTimeout(
            () => {
              timersRef.current.delete(
                id,
              );

              setToasts(
                (
                  currentToasts,
                ) =>
                  currentToasts.filter(
                    (
                      currentToast,
                    ) =>
                      currentToast.id !==
                      id,
                  ),
              );
            },
            duration,
          );

        timersRef.current.set(
          id,
          timer,
        );

        return id;
      },
      [],
    );

  const success =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        toast({
          title,
          description,
          variant:
            "success",
        }),
      [
        toast,
      ],
    );

  const error =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        toast({
          title,
          description,
          variant:
            "error",

          duration:
            5_000,
        }),
      [
        toast,
      ],
    );

  const info =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        toast({
          title,
          description,
          variant:
            "info",
        }),
      [
        toast,
      ],
    );

  const warning =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        toast({
          title,
          description,
          variant:
            "warning",

          duration:
            4_000,
        }),
      [
        toast,
      ],
    );

  useEffect(() => {
    const timers =
      timersRef.current;

    return () => {
      for (
        const timer
        of timers.values()
      ) {
        window.clearTimeout(
          timer,
        );
      }

      timers.clear();
    };
  }, []);

  const contextValue =
    useMemo<
      ToastContextValue
    >(
      () => ({
        toast,

        success,
        error,
        info,
        warning,

        dismiss,
        dismissAll,
      }),
      [
        dismiss,
        dismissAll,
        error,
        info,
        success,
        toast,
        warning,
      ],
    );

  return (
    <ToastContext.Provider
      value={
        contextValue
      }
    >
      {children}

      <div
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 top-20 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-20"
      >
        {toasts.map(
          (toastItem) => (
            <ToastCard
              key={
                toastItem.id
              }
              item={
                toastItem
              }
              onDismiss={
                dismiss
              }
            />
          ),
        )}
      </div>
    </ToastContext.Provider>
  );
}