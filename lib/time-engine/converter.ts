import {
  formatDate,
  formatTime,
} from "./formatter";

import { calculateTimeDifference } from "./difference";

import {
  TimeConversionResult,
  TimeLocation,
} from "./types";

export function convertInstant(
  instant: Date,
  from: TimeLocation,
  to: TimeLocation,
): TimeConversionResult {
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