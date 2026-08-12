import {
  DEFAULT_BUSINESS_HOURS,
  getLocalBusinessParts,
  isInsideBusinessHours,
} from "./businessHours";

import {
  calculateTimeDifference,
  formatTimeDifference,
} from "./difference";

import {
  formatDate,
  formatTime,
} from "./formatter";

import {
  findBestMeetingTimes,
  formatMeetingDate,
  formatMeetingTime,
  getMeetingComfortLabel,
} from "./meeting";

import {
  buildQuickFacts,
} from "./quickFacts";

import {
  buildTimeline,
} from "./timeline";

import type {
  TimeConversionResult,
  TimeLocation,
} from "./types";

import {
  formatDateTimeInput,
  getTimezoneOffset,
  zonedDateTimeToDate,
} from "./timezone";

export function convertTime(
  localDateTime: string,
  from: TimeLocation,
  to: TimeLocation,
): TimeConversionResult | null {
  const instant =
    zonedDateTimeToDate(
      localDateTime,
      from.timezone,
    );

  if (!instant) {
    return null;
  }

  return {
    instant,
    from,
    to,

    fromTime: formatTime(
      instant,
      from.timezone,
    ),

    toTime: formatTime(
      instant,
      to.timezone,
    ),

    fromDate: formatDate(
      instant,
      from.timezone,
    ),

    toDate: formatDate(
      instant,
      to.timezone,
    ),

    differenceHours:
      calculateTimeDifference(
        instant,
        from.timezone,
        to.timezone,
      ),
  };
}

export {
  buildQuickFacts,
  buildTimeline,
  calculateTimeDifference,
  DEFAULT_BUSINESS_HOURS,
  findBestMeetingTimes,
  formatDate,
  formatDateTimeInput,
  formatMeetingDate,
  formatMeetingTime,
  formatTime,
  formatTimeDifference,
  getLocalBusinessParts,
  getMeetingComfortLabel,
  getTimezoneOffset,
  isInsideBusinessHours,
  zonedDateTimeToDate,
};

export type {
  BusinessHours,
} from "./businessHours";

export type {
  FindBestMeetingTimesOptions,
  MeetingComfort,
  MeetingRecommendation,
} from "./meeting";

export type {
  QuickFactsInput,
  QuickFactsResult,
} from "./quickFacts";

export type {
  BuildTimelineOptions,
  TimelineRow,
} from "./timeline";

export type {
  MeetingSlot,
  TimeConversionResult,
  TimeLocation,
} from "./types";