"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useState,
} from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type ContactReason =
  | "general"
  | "support"
  | "correction"
  | "feature"
  | "business"
  | "privacy";

type ContactFormValues = {
  name: string;
  email: string;
  reason: ContactReason;
  subject: string;
  message: string;
  website: string;
};

type ContactFormErrors = Partial<
  Record<
    keyof ContactFormValues,
    string
  >
>;

type ContactFormProps = {
  contactEmail: string;
};

type SubmitStatus =
  | "idle"
  | "sending"
  | "success"
  | "error"
  | "copied";

type ApiResponse = {
  ok?: boolean;
  field?: keyof ContactFormValues;
  message?: string;
};

const INITIAL_VALUES:
  ContactFormValues = {
  name: "",
  email: "",
  reason: "general",
  subject: "",
  message: "",
  website: "",
};

const REASON_OPTIONS = [
  {
    value: "general",
    label: "General question",
  },
  {
    value: "support",
    label: "Technical support",
  },
  {
    value: "correction",
    label: "Time-zone or city correction",
  },
  {
    value: "feature",
    label: "Feature request",
  },
  {
    value: "business",
    label: "Business or partnership",
  },
  {
    value: "privacy",
    label: "Privacy request",
  },
] as const;

const MAX_NAME_LENGTH =
  100;

const MAX_SUBJECT_LENGTH =
  160;

const MAX_MESSAGE_LENGTH =
  5_000;

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(
  values:
    ContactFormValues,
): ContactFormErrors {
  const errors:
    ContactFormErrors = {};

  const normalizedName =
    values.name.trim();

  const normalizedEmail =
    values.email.trim();

  const normalizedSubject =
    values.subject.trim();

  const normalizedMessage =
    values.message.trim();

  if (!normalizedName) {
    errors.name =
      "Please enter your name.";
  } else if (
    normalizedName.length >
    MAX_NAME_LENGTH
  ) {
    errors.name =
      `Your name must contain fewer than ${MAX_NAME_LENGTH} characters.`;
  }

  if (!normalizedEmail) {
    errors.email =
      "Please enter your email address.";
  } else if (
    !EMAIL_PATTERN.test(
      normalizedEmail,
    )
  ) {
    errors.email =
      "Please enter a valid email address.";
  }

  if (!normalizedSubject) {
    errors.subject =
      "Please enter a subject.";
  } else if (
    normalizedSubject.length >
    MAX_SUBJECT_LENGTH
  ) {
    errors.subject =
      `The subject must contain fewer than ${MAX_SUBJECT_LENGTH} characters.`;
  }

  if (!normalizedMessage) {
    errors.message =
      "Please describe your question or request.";
  } else if (
    normalizedMessage.length <
    20
  ) {
    errors.message =
      "Please provide at least 20 characters so we can understand your request.";
  } else if (
    normalizedMessage.length >
    MAX_MESSAGE_LENGTH
  ) {
    errors.message =
      `Your message must contain fewer than ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return errors;
}

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="mt-2 text-xs leading-5 text-danger"
    >
      {message}
    </p>
  );
}

export default function ContactForm({
  contactEmail,
}: ContactFormProps) {
  const [
    values,
    setValues,
  ] = useState<
    ContactFormValues
  >(
    INITIAL_VALUES,
  );

  const [
    errors,
    setErrors,
  ] = useState<
    ContactFormErrors
  >({});

  const [
    status,
    setStatus,
  ] = useState<
    SubmitStatus
  >(
    "idle",
  );

  const [
    submitMessage,
    setSubmitMessage,
  ] = useState(
    "",
  );

  const remainingCharacters =
    useMemo(
      () =>
        MAX_MESSAGE_LENGTH -
        values.message.length,
      [
        values.message.length,
      ],
    );

  const isSubmitting =
    status ===
    "sending";

  function updateField<
    Key extends keyof ContactFormValues,
  >(
    field: Key,
    value:
      ContactFormValues[Key],
  ): void {
    setValues(
      (
        currentValues,
      ) => ({
        ...currentValues,

        [field]:
          value,
      }),
    );

    setErrors(
      (
        currentErrors,
      ) => ({
        ...currentErrors,

        [field]:
          undefined,
      }),
    );

    if (
      status !==
      "sending"
    ) {
      setStatus(
        "idle",
      );

      setSubmitMessage(
        "",
      );
    }
  }

  function handleInputChange(
    event:
      ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
      >,
  ): void {
    const {
      name,
      value,
    } =
      event.target;

    updateField(
      name as keyof ContactFormValues,
      value as never,
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors =
      validateForm(
        values,
      );

    if (
      Object.keys(
        validationErrors,
      ).length >
      0
    ) {
      setErrors(
        validationErrors,
      );

      setStatus(
        "idle",
      );

      setSubmitMessage(
        "",
      );

      const firstInvalidField =
        Object.keys(
          validationErrors,
        )[0];

      if (
        firstInvalidField
      ) {
        document
          .querySelector<
            HTMLElement
          >(
            `[name="${firstInvalidField}"]`,
          )
          ?.focus();
      }

      return;
    }

    setErrors(
      {},
    );

    setStatus(
      "sending",
    );

    setSubmitMessage(
      "",
    );

    try {
      const response =
        await fetch(
          "/api/contact",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  values.name.trim(),

                email:
                  values.email.trim(),

                reason:
                  values.reason,

                subject:
                  values.subject.trim(),

                message:
                  values.message.trim(),

                website:
                  values.website.trim(),
              }),
          },
        );

      let payload:
        ApiResponse = {};

      try {
        payload =
          (await response.json()) as
            ApiResponse;
      } catch {
        payload = {};
      }

      if (
        !response.ok ||
        payload.ok ===
          false
      ) {
        if (
          payload.field
        ) {
          setErrors({
            [payload.field]:
              payload.message ??
              "Please check this field.",
          });

          document
            .querySelector<
              HTMLElement
            >(
              `[name="${payload.field}"]`,
            )
            ?.focus();
        }

        setStatus(
          "error",
        );

        setSubmitMessage(
          payload.message ??
          "We couldn't send your message. Please try again.",
        );

        return;
      }

      setStatus(
        "success",
      );

      setSubmitMessage(
        "Your message has been sent successfully. Thank you for contacting TimeInOne.",
      );

      setValues(
        INITIAL_VALUES,
      );

      setErrors(
        {},
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Contact form submission failed:",
        error,
      );

      setStatus(
        "error",
      );

      setSubmitMessage(
        "We couldn't send your message. Please check your connection and try again.",
      );
    }
  }

  async function copyEmail():
    Promise<void> {
    try {
      await navigator.clipboard.writeText(
        contactEmail,
      );
    } catch {
      const textArea =
        document.createElement(
          "textarea",
        );

      textArea.value =
        contactEmail;

      textArea.style.position =
        "fixed";

      textArea.style.opacity =
        "0";

      document.body.appendChild(
        textArea,
      );

      textArea.select();

      document.execCommand(
        "copy",
      );

      textArea.remove();
    }

    setStatus(
      "copied",
    );

    setSubmitMessage(
      "",
    );

    window.setTimeout(
      () => {
        setStatus(
          "idle",
        );
      },
      2_000,
    );
  }

  function resetForm():
    void {
    setValues(
      INITIAL_VALUES,
    );

    setErrors(
      {},
    );

    setStatus(
      "idle",
    );

    setSubmitMessage(
      "",
    );
  }

  const inputClasses = [
    "h-12",
    "w-full",
    "rounded-xl",
    "border",
    "border-border",
    "bg-surface",
    "px-4",
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
    "disabled:cursor-not-allowed",
    "disabled:bg-surface-muted",
  ].join(" ");

  return (
    <Card
      variant="elevated"
      padding="none"
      className="overflow-hidden"
    >
      <div className="border-b border-border bg-surface-soft p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Send a message
        </p>

        <h2 className="mt-2 text-2xl font-bold text-text-primary">
          How can we help?
        </h2>

        <p className="mt-3 text-sm leading-7 text-text-secondary">
          Complete the form below
          and send your message
          directly to TimeInOne.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          void handleSubmit(
            event,
          );
        }}
        noValidate
        className="bg-surface p-5 sm:p-6"
      >
        <div
          aria-hidden="true"
          className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="contact-website">
            Website
          </label>

          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={
              values.website
            }
            onChange={
              handleInputChange
            }
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-text-primary">
              Your name
            </span>

            <input
              name="name"
              type="text"
              autoComplete="name"
              maxLength={
                MAX_NAME_LENGTH
              }
              value={
                values.name
              }
              onChange={
                handleInputChange
              }
              disabled={
                isSubmitting
              }
              aria-invalid={
                Boolean(
                  errors.name,
                )
              }
              placeholder="Your full name"
              className={
                inputClasses
              }
            />

            <FieldError
              message={
                errors.name
              }
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-text-primary">
              Email address
            </span>

            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={
                values.email
              }
              onChange={
                handleInputChange
              }
              disabled={
                isSubmitting
              }
              aria-invalid={
                Boolean(
                  errors.email,
                )
              }
              placeholder="you@example.com"
              className={
                inputClasses
              }
            />

            <FieldError
              message={
                errors.email
              }
            />
          </label>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-text-primary">
              Reason for contacting us
            </span>

            <select
              name="reason"
              value={
                values.reason
              }
              onChange={
                handleInputChange
              }
              disabled={
                isSubmitting
              }
              className={
                inputClasses
              }
            >
              {REASON_OPTIONS.map(
                (
                  option,
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-text-primary">
              Subject
            </span>

            <input
              name="subject"
              type="text"
              maxLength={
                MAX_SUBJECT_LENGTH
              }
              value={
                values.subject
              }
              onChange={
                handleInputChange
              }
              disabled={
                isSubmitting
              }
              aria-invalid={
                Boolean(
                  errors.subject,
                )
              }
              placeholder="What is your message about?"
              className={
                inputClasses
              }
            />

            <FieldError
              message={
                errors.subject
              }
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-text-primary">
            Message
          </span>

          <textarea
            name="message"
            rows={8}
            maxLength={
              MAX_MESSAGE_LENGTH
            }
            value={
              values.message
            }
            onChange={
              handleInputChange
            }
            disabled={
              isSubmitting
            }
            aria-invalid={
              Boolean(
                errors.message,
              )
            }
            placeholder="Please provide enough information for us to understand your question, correction or feature request."
            className={[
              inputClasses,
              "h-auto",
              "min-h-44",
              "resize-y",
              "py-3",
              "leading-7",
            ].join(" ")}
          />

          <div className="mt-2 flex items-start justify-between gap-4">
            <FieldError
              message={
                errors.message
              }
            />

            <span className="ml-auto shrink-0 text-xs tabular-nums text-text-muted">
              {
                remainingCharacters
              }{" "}
              characters remaining
            </span>
          </div>
        </label>

        {status ===
          "success" && (
          <div
            role="status"
            className="mt-5 rounded-2xl border border-success/20 bg-success-soft p-4"
          >
            <p className="font-semibold text-success">
              Message sent successfully.
            </p>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {submitMessage}
            </p>
          </div>
        )}

        {status ===
          "error" && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-danger/20 bg-danger-soft p-4"
          >
            <p className="font-semibold text-danger">
              Message not sent.
            </p>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {submitMessage}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={
              isSubmitting
            }
            className="gap-2"
          >
            <span aria-hidden="true">
              {isSubmitting
                ? "…"
                : "→"}
            </span>

            {isSubmitting
              ? "Sending..."
              : "Send message"}
          </Button>

          <Button
            type="button"
            onClick={() => {
              void copyEmail();
            }}
            disabled={
              isSubmitting
            }
            variant={
              status ===
              "copied"
                ? "secondary"
                : "outline"
            }
            size="lg"
            className={
              status ===
              "copied"
                ? "gap-2 border-success/30 bg-success-soft text-success hover:border-success/40 hover:bg-success-soft"
                : "gap-2"
            }
          >
            <span aria-hidden="true">
              {status ===
              "copied"
                ? "✓"
                : "⧉"}
            </span>

            {status ===
            "copied"
              ? "Email copied"
              : "Copy email address"}
          </Button>

          <Button
            type="button"
            onClick={
              resetForm
            }
            disabled={
              isSubmitting
            }
            variant="ghost"
            size="lg"
            className="sm:ml-auto"
          >
            Clear form
          </Button>
        </div>

        <p className="mt-5 text-xs leading-6 text-text-muted">
          Your message is sent
          securely to TimeInOne.
          Your email address is used
          only so we can reply to
          your request.
        </p>
      </form>
    </Card>
  );
}