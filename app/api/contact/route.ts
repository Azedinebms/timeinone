import { Resend } from "resend";

const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL ??
  "contact@timeinone.com";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY;

const resend =
  RESEND_API_KEY
    ? new Resend(
        RESEND_API_KEY,
      )
    : null;

const MAX_NAME_LENGTH =
  100;

const MAX_SUBJECT_LENGTH =
  160;

const MAX_MESSAGE_LENGTH =
  5_000;

const MIN_MESSAGE_LENGTH =
  20;

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_REASONS = new Set([
  "general",
  "support",
  "correction",
  "feature",
  "business",
  "privacy",
]);

const REASON_LABELS:
  Record<
    string,
    string
  > = {
  general:
    "General question",

  support:
    "Technical support",

  correction:
    "Time-zone or city correction",

  feature:
    "Feature request",

  business:
    "Business or partnership",

  privacy:
    "Privacy request",
};

type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  reason?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function normalizeString(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function escapeHtml(
  value: string,
): string {
  return value
    .replace(
      /&/g,
      "&amp;",
    )
    .replace(
      /</g,
      "&lt;",
    )
    .replace(
      />/g,
      "&gt;",
    )
    .replace(
      /"/g,
      "&quot;",
    )
    .replace(
      /'/g,
      "&#039;",
    );
}

function buildEmailHtml({
  name,
  email,
  reasonLabel,
  subject,
  message,
}: {
  name: string;
  email: string;
  reasonLabel: string;
  subject: string;
  message: string;
}): string {
  const safeName =
    escapeHtml(
      name,
    );

  const safeEmail =
    escapeHtml(
      email,
    );

  const safeReason =
    escapeHtml(
      reasonLabel,
    );

  const safeSubject =
    escapeHtml(
      subject,
    );

  const safeMessage =
    escapeHtml(
      message,
    ).replace(
      /\n/g,
      "<br />",
    );

  return `
    <div
      style="
        margin:0;
        padding:32px;
        background:#f6f8fc;
        font-family:Arial,Helvetica,sans-serif;
        color:#0f172a;
      "
    >
      <div
        style="
          max-width:680px;
          margin:0 auto;
          overflow:hidden;
          border:1px solid #e2e8f0;
          border-radius:20px;
          background:#ffffff;
        "
      >
        <div
          style="
            padding:24px 28px;
            background:#f8fafc;
            border-bottom:1px solid #e2e8f0;
          "
        >
          <p
            style="
              margin:0 0 8px;
              color:#2563eb;
              font-size:12px;
              font-weight:700;
              letter-spacing:.12em;
              text-transform:uppercase;
            "
          >
            TimeInOne Contact
          </p>

          <h1
            style="
              margin:0;
              font-size:24px;
              line-height:1.3;
            "
          >
            ${safeSubject}
          </h1>
        </div>

        <div
          style="
            padding:28px;
          "
        >
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            style="
              width:100%;
              margin-bottom:28px;
              border-collapse:collapse;
            "
          >
            <tr>
              <td
                style="
                  padding:8px 0;
                  width:150px;
                  color:#64748b;
                  font-size:14px;
                "
              >
                Name
              </td>

              <td
                style="
                  padding:8px 0;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${safeName}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:8px 0;
                  color:#64748b;
                  font-size:14px;
                "
              >
                Email
              </td>

              <td
                style="
                  padding:8px 0;
                  font-size:14px;
                "
              >
                ${safeEmail}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:8px 0;
                  color:#64748b;
                  font-size:14px;
                "
              >
                Reason
              </td>

              <td
                style="
                  padding:8px 0;
                  font-size:14px;
                "
              >
                ${safeReason}
              </td>
            </tr>
          </table>

          <div
            style="
              padding:20px;
              border-radius:14px;
              background:#f8fafc;
              font-size:15px;
              line-height:1.7;
            "
          >
            ${safeMessage}
          </div>

          <p
            style="
              margin:24px 0 0;
              color:#64748b;
              font-size:12px;
              line-height:1.6;
            "
          >
            This message was submitted through
            the TimeInOne contact form.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(
  request: Request,
) {
  if (
    !resend ||
    !RESEND_API_KEY
  ) {
    console.error(
      "RESEND_API_KEY is missing.",
    );

    return Response.json(
      {
        ok: false,
        message:
          "Email service is not configured.",
      },
      {
        status: 500,
      },
    );
  }

  let body:
    ContactRequestBody;

  try {
    body =
      (await request.json()) as
        ContactRequestBody;
  } catch {
    return Response.json(
      {
        ok: false,
        message:
          "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const name =
    normalizeString(
      body.name,
    );

  const email =
    normalizeString(
      body.email,
    );

  const reason =
    normalizeString(
      body.reason,
    );

  const subject =
    normalizeString(
      body.subject,
    );

  const message =
    normalizeString(
      body.message,
    );

  const website =
    normalizeString(
      body.website,
    );

  /*
   * Honeypot.
   *
   * Real users never see this field.
   * Bots often fill it automatically.
   *
   * Return success intentionally so
   * bots cannot easily detect the trap.
   */
  if (website) {
    return Response.json(
      {
        ok: true,
      },
      {
        status: 200,
      },
    );
  }

  if (
    !name ||
    name.length >
      MAX_NAME_LENGTH
  ) {
    return Response.json(
      {
        ok: false,
        field:
          "name",
        message:
          "Please enter a valid name.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !email ||
    !EMAIL_PATTERN.test(
      email,
    )
  ) {
    return Response.json(
      {
        ok: false,
        field:
          "email",
        message:
          "Please enter a valid email address.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !ALLOWED_REASONS.has(
      reason,
    )
  ) {
    return Response.json(
      {
        ok: false,
        field:
          "reason",
        message:
          "Please select a valid contact reason.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !subject ||
    subject.length >
      MAX_SUBJECT_LENGTH
  ) {
    return Response.json(
      {
        ok: false,
        field:
          "subject",
        message:
          "Please enter a valid subject.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    message.length <
      MIN_MESSAGE_LENGTH ||
    message.length >
      MAX_MESSAGE_LENGTH
  ) {
    return Response.json(
      {
        ok: false,
        field:
          "message",
        message:
          `Your message must contain between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters.`,
      },
      {
        status: 400,
      },
    );
  }

  const reasonLabel =
    REASON_LABELS[
      reason
    ] ??
    "General question";

  const emailSubject =
    [
      "TimeInOne",
      reasonLabel,
      subject,
    ].join(
      " — ",
    );

  try {
    const {
      data,
      error,
    } =
      await resend.emails.send(
        {
          from:
            "TimeInOne Contact <contact@timeinone.com>",

          to: [
            CONTACT_EMAIL,
          ],

          replyTo:
            email,

          subject:
            emailSubject,

          html:
            buildEmailHtml({
              name,
              email,
              reasonLabel,
              subject,
              message,
            }),

          text: [
            "TimeInOne Contact",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Reason: ${reasonLabel}`,
            `Subject: ${subject}`,
            "",
            "Message:",
            message,
            "",
            "Submitted through the TimeInOne contact form.",
          ].join(
            "\n",
          ),
        },
      );

    if (error) {
      console.error(
        "Resend contact error:",
        error,
      );

      return Response.json(
        {
          ok: false,
          message:
            "We couldn't send your message. Please try again.",
        },
        {
          status: 502,
        },
      );
    }

    return Response.json(
      {
        ok: true,
        id:
          data?.id ??
          null,
      },
      {
        status: 200,
      },
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "Contact API error:",
      error,
    );

    return Response.json(
      {
        ok: false,
        message:
          "We couldn't send your message. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}