"use client";

import type {
  MeetingPlannerSettings,
} from "../types";

type MeetingSettingsProps = {
  settings:
    MeetingPlannerSettings;

  onChange: (
    values:
      Partial<MeetingPlannerSettings>,
  ) => void;
};

const DURATION_OPTIONS = [
  15,
  30,
  45,
  60,
  90,
  120,
] as const;

const INTERVAL_OPTIONS = [
  15,
  30,
  60,
] as const;

export default function MeetingSettings({
  settings,
  onChange,
}: MeetingSettingsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <label className="min-w-0">
        <span className="mb-2 block text-sm font-medium text-text-primary">
          Meeting date
        </span>

        <input
          type="date"
          value={
            settings.date
          }
          onChange={(
            event,
          ) => {
            onChange({
              date:
                event.target.value,
            });
          }}
          className="h-11 w-full min-w-0 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary shadow-sm outline-none transition [color-scheme:light] hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label className="min-w-0">
        <span className="mb-2 block text-sm font-medium text-text-primary">
          Duration
        </span>

        <select
          value={
            settings
              .durationMinutes
          }
          onChange={(
            event,
          ) => {
            onChange({
              durationMinutes:
                Number(
                  event.target
                    .value,
                ),
            });
          }}
          className="h-11 w-full min-w-0 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary shadow-sm outline-none transition hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          {DURATION_OPTIONS.map(
            (
              duration,
            ) => (
              <option
                key={
                  duration
                }
                value={
                  duration
                }
              >
                {
                  duration
                }{" "}
                minutes
              </option>
            ),
          )}
        </select>
      </label>

      <label className="min-w-0">
        <span className="mb-2 block text-sm font-medium text-text-primary">
          Time interval
        </span>

        <select
          value={
            settings
              .intervalMinutes
          }
          onChange={(
            event,
          ) => {
            onChange({
              intervalMinutes:
                Number(
                  event.target
                    .value,
                ),
            });
          }}
          className="h-11 w-full min-w-0 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary shadow-sm outline-none transition hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          {INTERVAL_OPTIONS.map(
            (
              interval,
            ) => (
              <option
                key={
                  interval
                }
                value={
                  interval
                }
              >
                Every{" "}
                {
                  interval
                }{" "}
                minutes
              </option>
            ),
          )}
        </select>
      </label>

      <label className="flex min-w-0 items-end">
        <span className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 shadow-sm transition hover:border-primary-muted hover:bg-primary-soft">
          <input
            type="checkbox"
            checked={
              settings
                .allowCompromise
            }
            onChange={(
              event,
            ) => {
              onChange({
                allowCompromise:
                  event.target
                    .checked,
              });
            }}
            className="h-4 w-4 rounded border-border-strong bg-surface text-primary accent-primary"
          />

          <span className="text-sm font-medium text-text-secondary">
            Allow compromise slots
          </span>
        </span>
      </label>
    </div>
  );
}