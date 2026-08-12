import {
  createGmtOffsetTimezone,
  createUtcOffsetTimezone,
} from "./dynamic-offset";

import type {
  TimezoneDefinition,
} from "./types";

/*
 * Offsets sélectionnés pour TimeInOne.
 *
 * Cette liste couvre :
 * - les offsets entiers les plus courants ;
 * - les offsets de 30 minutes ;
 * - les offsets de 45 minutes ;
 * - les extrêmes UTC-12 et UTC+14.
 *
 * Les valeurs sont exprimées en minutes.
 */
export const SELECTED_WORLD_OFFSET_MINUTES = [
  -720,
  -660,
  -600,
  -570,
  -540,
  -480,
  -420,
  -360,
  -300,
  -240,
  -210,
  -180,
  -120,
  -60,

  0,

  60,
  120,
  180,
  210,
  240,
  270,
  300,
  330,
  345,
  360,
  390,
  420,
  480,
  525,
  540,
  570,
  600,
  630,
  660,
  720,
  765,
  780,
  840,
] as const;

function removeNullTimezones(
  timezones: Array<
    TimezoneDefinition | null
  >,
) {
  return timezones.filter(
    (
      timezone,
    ): timezone is TimezoneDefinition =>
      timezone !== null,
  );
}

export function getSelectedUtcOffsets():
  TimezoneDefinition[] {
  return removeNullTimezones(
    SELECTED_WORLD_OFFSET_MINUTES.map(
      (offsetMinutes) =>
        createUtcOffsetTimezone(
          offsetMinutes,
        ),
    ),
  );
}

export function getSelectedGmtOffsets():
  TimezoneDefinition[] {
  return removeNullTimezones(
    SELECTED_WORLD_OFFSET_MINUTES.map(
      (offsetMinutes) =>
        createGmtOffsetTimezone(
          offsetMinutes,
        ),
    ),
  );
}

export function getSelectedOffsetTimezones():
  TimezoneDefinition[] {
  const offsets = [
    ...getSelectedUtcOffsets(),
    ...getSelectedGmtOffsets(),
  ];

  const uniqueTimezones:
    TimezoneDefinition[] = [];

  const usedSlugs =
    new Set<string>();

  for (const timezone of offsets) {
    if (
      usedSlugs.has(
        timezone.slug,
      )
    ) {
      continue;
    }

    usedSlugs.add(
      timezone.slug,
    );

    uniqueTimezones.push(
      timezone,
    );
  }

  return uniqueTimezones;
}