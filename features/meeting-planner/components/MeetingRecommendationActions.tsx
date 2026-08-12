"use client";

import {
  useState,
} from "react";

import type {
  MeetingRecommendation,
} from "../types";

type MeetingRecommendationActionsProps = {
  recommendation:
    MeetingRecommendation;

  durationMinutes:
    number;

  onShare?: (
    instant:
      Date,
  ) => void;

  singleLine?:
    boolean;
};

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M12 16V4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 8L12 4L16 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 12V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 8V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M5 12.5L9.5 17L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M12 4V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 11L12 15L16 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 19H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function escapeIcsText(
  value:
    string,
): string {
  return value
    .replace(
      /\\/g,
      "\\\\",
    )
    .replace(
      /\n/g,
      "\\n",
    )
    .replace(
      /,/g,
      "\\,",
    )
    .replace(
      /;/g,
      "\\;",
    );
}

function formatIcsDate(
  date:
    Date,
): string {
  return date
    .toISOString()
    .replace(
      /[-:]/g,
      "",
    )
    .replace(
      /\.\d{3}Z$/,
      "Z",
    );
}

function createMeetingDescription(
  recommendation:
    MeetingRecommendation,
): string {
  const participantLines =
    recommendation.participants.map(
      (
        participant,
      ) =>
        `${participant.cityName}, ${participant.countryCode}: ` +
        `${participant.localTime} — ${participant.localDate} ` +
        `(${participant.timezone})`,
    );

  return [
    "International meeting planned with TimeInOne.",
    "",
    ...participantLines,
    "",
    `Meeting score: ${recommendation.score}/100`,
    `Quality: ${recommendation.quality}`,
    recommendation.isStrictOverlap
      ? "All participants are inside working hours."
      : `${recommendation.workingParticipants} of ` +
        `${recommendation.totalParticipants} participants ` +
        "are inside working hours.",
  ].join(
    "\n",
  );
}

function createClipboardText(
  recommendation:
    MeetingRecommendation,

  durationMinutes:
    number,
): string {
  const participantLines =
    recommendation.participants.map(
      (
        participant,
      ) => {
        const comfortLabel =
          participant.isInsideBusinessHours
            ? "Working hours"
            : participant.comfort;

        return (
          `${participant.cityName}, ` +
          `${participant.countryName}: ` +
          `${participant.localTime}, ` +
          `${participant.localDate} — ` +
          `${comfortLabel}`
        );
      },
    );

  return [
    "TimeInOne — Meeting time",
    "",
    ...participantLines,
    "",
    `Duration: ${durationMinutes} minutes`,
    `Meeting score: ${recommendation.score}/100`,
    `Quality: ${recommendation.quality}`,
  ].join(
    "\n",
  );
}

function downloadCalendarEvent(
  recommendation:
    MeetingRecommendation,

  durationMinutes:
    number,
): void {
  const startDate =
    recommendation.instant;

  const endDate =
    new Date(
      startDate.getTime() +
        durationMinutes *
          60_000,
    );

  const timestamp =
    new Date();

  const uid = [
    recommendation.id,
    "timeinone",
  ].join(
    "@",
  );

  const description =
    createMeetingDescription(
      recommendation,
    );

  const calendarContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TimeInOne//Meeting Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(
      timestamp,
    )}`,
    `DTSTART:${formatIcsDate(
      startDate,
    )}`,
    `DTEND:${formatIcsDate(
      endDate,
    )}`,
    "SUMMARY:International meeting",
    `DESCRIPTION:${escapeIcsText(
      description,
    )}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join(
    "\r\n",
  );

  const calendarBlob =
    new Blob(
      [
        calendarContent,
      ],
      {
        type:
          "text/calendar;charset=utf-8",
      },
    );

  const downloadUrl =
    URL.createObjectURL(
      calendarBlob,
    );

  const downloadLink =
    document.createElement(
      "a",
    );

  downloadLink.href =
    downloadUrl;

  downloadLink.download =
    `timeinone-meeting-${startDate
      .toISOString()
      .slice(
        0,
        16,
      )
      .replace(
        /[:T]/g,
        "-",
      )}.ics`;

  document.body.appendChild(
    downloadLink,
  );

  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(
    downloadUrl,
  );
}

export default function MeetingRecommendationActions({
  recommendation,
  durationMinutes,
  onShare,
  singleLine = false,
}: MeetingRecommendationActionsProps) {
  const [
    copied,
    setCopied,
  ] =
    useState(
      false,
    );

  async function copyMeetingDetails():
    Promise<void> {
    const clipboardText =
      createClipboardText(
        recommendation,
        durationMinutes,
      );

    try {
      await navigator.clipboard.writeText(
        clipboardText,
      );
    } catch {
      const textArea =
        document.createElement(
          "textarea",
        );

      textArea.value =
        clipboardText;

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

    setCopied(
      true,
    );

    window.setTimeout(
      () => {
        setCopied(
          false,
        );
      },
      2_000,
    );
  }

  const secondaryButtonClasses = [
    "group",
    "relative",
    "inline-flex",
    "h-11",
    "shrink-0",
    "items-center",
    "justify-center",
    "gap-2.5",
    "overflow-hidden",
    "rounded-xl",
    "border",
    "border-slate-200",
    "bg-white",
    "px-4",
    "text-sm",
    "font-semibold",
    "text-slate-700",
    "shadow-sm",
    "outline-none",
    "transition-all",
    "duration-200",
    "hover:-translate-y-0.5",
    "hover:border-slate-300",
    "hover:bg-slate-50",
    "hover:text-slate-950",
    "hover:shadow-md",
    "active:translate-y-0",
    "active:scale-[0.98]",
    "focus-visible:ring-4",
    "focus-visible:ring-blue-500/10",
  ].join(
    " ",
  );

  return (
    <div
      className={[
        "flex",
        "items-center",
        "gap-2.5",

        singleLine
          ? "flex-nowrap"
          : "flex-wrap",
      ].join(
        " ",
      )}
    >
      {onShare && (
        <button
          type="button"
          onClick={() => {
            onShare(
              recommendation.instant,
            );
          }}
          className={[
            secondaryButtonClasses,
            "hover:border-violet-200",
            "hover:bg-violet-50",
            "hover:text-violet-700",
          ].join(
            " ",
          )}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
            <ShareIcon />
          </span>

          <span>
            Share slot
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          void copyMeetingDetails();
        }}
        className={[
          secondaryButtonClasses,

          copied
            ? [
                "border-emerald-200",
                "bg-emerald-50",
                "text-emerald-700",
              ].join(
                " ",
              )
            : [
                "hover:border-emerald-200",
                "hover:bg-emerald-50",
                "hover:text-emerald-700",
              ].join(
                " ",
              ),
        ].join(
          " ",
        )}
      >
        <span
          className={[
            "flex",
            "h-7",
            "w-7",
            "items-center",
            "justify-center",
            "rounded-lg",
            "transition",

            copied
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700",
          ].join(
            " ",
          )}
        >
          {copied
            ? <CheckIcon />
            : <CopyIcon />}
        </span>

        <span>
          {copied
            ? "Copied"
            : "Copy details"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          downloadCalendarEvent(
            recommendation,
            durationMinutes,
          );
        }}
        className={[
          "group",
          "relative",
          "inline-flex",
          "h-11",
          "shrink-0",
          "items-center",
          "justify-center",
          "gap-2.5",
          "overflow-hidden",
          "rounded-xl",
          "border",
          "border-blue-600",
          "bg-gradient-to-r",
          "from-blue-600",
          "via-blue-600",
          "to-indigo-600",
          "px-5",
          "text-sm",
          "font-bold",
          "text-white",
          "shadow-lg",
          "shadow-blue-500/20",
          "outline-none",
          "transition-all",
          "duration-200",
          "hover:-translate-y-0.5",
          "hover:from-blue-500",
          "hover:via-blue-500",
          "hover:to-indigo-500",
          "hover:shadow-xl",
          "hover:shadow-blue-500/25",
          "active:translate-y-0",
          "active:scale-[0.98]",
          "focus-visible:ring-4",
          "focus-visible:ring-blue-500/20",
        ].join(
          " ",
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        />

        <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20">
          <DownloadIcon />
        </span>

        <span className="relative">
          Download .ics
        </span>
      </button>
    </div>
  );
}