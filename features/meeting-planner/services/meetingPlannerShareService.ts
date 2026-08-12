import type {
  CitySearchResult,
} from "@/features/city-search/types";

import type {
  BusinessHours,
} from "@/lib/time-engine";

import type {
  MeetingParticipant,
  MeetingPlannerSettings,
} from "../types";

const MAX_SHARED_PARTICIPANTS =
  5;

export type SharedMeetingParticipant = {
  routeSlug: string;

  businessHours: {
    startHour: number;
    endHour: number;
  };
};

export type SharedMeetingPlannerState = {
  participants:
    SharedMeetingParticipant[];

  settings: {
    date: string;

    durationMinutes: number;
    intervalMinutes: number;

    allowCompromise: boolean;
  };

  selectedSlot:
    string | null;
};

type CreateMeetingShareUrlOptions = {
  participants:
    MeetingParticipant[];

  settings:
    MeetingPlannerSettings;

  selectedSlot?: Date | null;

  origin?: string;
};

function normalizeInteger(
  value: string | null,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsedValue =
    Number(value);

  if (
    !Number.isFinite(
      parsedValue,
    )
  ) {
    return fallback;
  }

  return Math.min(
    maximum,
    Math.max(
      minimum,
      Math.floor(
        parsedValue,
      ),
    ),
  );
}

function normalizeHour(
  value: string,
  fallback: number,
): number {
  const parsedValue =
    Number(value);

  if (
    !Number.isInteger(
      parsedValue,
    ) ||
    parsedValue < 0 ||
    parsedValue > 24
  ) {
    return fallback;
  }

  return parsedValue;
}

function normalizeRouteSlug(
  value: string,
): string {
  try {
    return decodeURIComponent(
      value,
    )
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  } catch {
    return "";
  }
}

function isValidDateValue(
  value: string | null,
): value is string {
  if (
    !value ||
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  ) {
    return false;
  }

  const parsedDate =
    new Date(
      `${value}T00:00:00Z`,
    );

  return !Number.isNaN(
    parsedDate.getTime(),
  );
}

function serializeParticipants(
  participants:
    MeetingParticipant[],
): {
  cities: string;
  hours: string;
} {
  const selectedParticipants =
    participants.slice(
      0,
      MAX_SHARED_PARTICIPANTS,
    );

  return {
    cities:
      selectedParticipants
        .map(
          (participant) =>
            participant.city
              .routeSlug,
        )
        .join(","),

    hours:
      selectedParticipants
        .map(
          (participant) =>
            [
              participant
                .businessHours
                .startHour,

              participant
                .businessHours
                .endHour,
            ].join("-"),
        )
        .join(","),
  };
}

export function createMeetingShareUrl({
  participants,
  settings,
  selectedSlot = null,
  origin,
}: CreateMeetingShareUrlOptions): string {
  const baseOrigin =
    origin ??
    (
      typeof window !==
      "undefined"
        ? window.location.origin
        : ""
    );

  const url =
    new URL(
      "/meeting-planner",
      baseOrigin ||
        "http://localhost",
    );

  const serializedParticipants =
    serializeParticipants(
      participants,
    );

  if (
    serializedParticipants
      .cities
  ) {
    url.searchParams.set(
      "cities",
      serializedParticipants
        .cities,
    );

    url.searchParams.set(
      "hours",
      serializedParticipants
        .hours,
    );
  }

  url.searchParams.set(
    "date",
    settings.date,
  );

  url.searchParams.set(
    "duration",
    String(
      settings.durationMinutes,
    ),
  );

  url.searchParams.set(
    "interval",
    String(
      settings.intervalMinutes,
    ),
  );

  url.searchParams.set(
    "compromise",
    settings.allowCompromise
      ? "1"
      : "0",
  );

  if (
    selectedSlot &&
    !Number.isNaN(
      selectedSlot.getTime(),
    )
  ) {
    url.searchParams.set(
      "slot",
      selectedSlot.toISOString(),
    );
  }

  if (!baseOrigin) {
    return (
      url.pathname +
      url.search
    );
  }

  return url.toString();
}

export function parseMeetingShareParams(
  searchParams:
    URLSearchParams,
): SharedMeetingPlannerState {
  const cityValues =
    (
      searchParams.get(
        "cities",
      ) ?? ""
    )
      .split(",")
      .map(
        normalizeRouteSlug,
      )
      .filter(Boolean)
      .slice(
        0,
        MAX_SHARED_PARTICIPANTS,
      );

  const hoursValues =
    (
      searchParams.get(
        "hours",
      ) ?? ""
    ).split(",");

  const participants =
    cityValues.map(
      (
        routeSlug,
        index,
      ) => {
        const rawHours =
          hoursValues[index] ??
          "";

        const [
          rawStartHour,
          rawEndHour,
        ] =
          rawHours.split("-");

        const startHour =
          normalizeHour(
            rawStartHour,
            9,
          );

        let endHour =
          normalizeHour(
            rawEndHour,
            18,
          );

        if (
          endHour <=
          startHour
        ) {
          endHour =
            Math.min(
              24,
              startHour + 1,
            );
        }

        return {
          routeSlug,

          businessHours: {
            startHour,
            endHour,
          },
        };
      },
    );

  const rawDate =
    searchParams.get(
      "date",
    );

  const today =
    new Date()
      .toISOString()
      .slice(
        0,
        10,
      );

  const durationMinutes =
    normalizeInteger(
      searchParams.get(
        "duration",
      ),
      60,
      15,
      240,
    );

  const intervalMinutes =
    normalizeInteger(
      searchParams.get(
        "interval",
      ),
      30,
      15,
      60,
    );

  const rawSelectedSlot =
    searchParams.get(
      "slot",
    );

  const parsedSelectedSlot =
    rawSelectedSlot
      ? new Date(
          rawSelectedSlot,
        )
      : null;

  return {
    participants,

    settings: {
      date:
        isValidDateValue(
          rawDate,
        )
          ? rawDate
          : today,

      durationMinutes,

      intervalMinutes,

      allowCompromise:
        searchParams.get(
          "compromise",
        ) !== "0",
    },

    selectedSlot:
      parsedSelectedSlot &&
      !Number.isNaN(
        parsedSelectedSlot.getTime(),
      )
        ? parsedSelectedSlot
            .toISOString()
        : null,
  };
}

export function createSharedParticipant({
  city,
  businessHours,
}: {
  city:
    CitySearchResult;

  businessHours:
    Pick<
      BusinessHours,
      | "startHour"
      | "endHour"
    >;
}): MeetingParticipant {
  return {
    id: [
      city.routeSlug,
      city.id,
    ].join("-"),

    city,

    businessHours: {
      startHour:
        businessHours.startHour,

      endHour:
        businessHours.endHour,

      workingDays: [
        1,
        2,
        3,
        4,
        5,
      ],
    },
  };
}

export const meetingPlannerShareService = {
  createUrl:
    createMeetingShareUrl,

  parseParams:
    parseMeetingShareParams,

  createParticipant:
    createSharedParticipant,
};

export default meetingPlannerShareService;