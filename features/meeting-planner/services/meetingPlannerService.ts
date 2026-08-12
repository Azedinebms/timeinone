import {
  getLocalBusinessParts,
  isInsideBusinessHours,
  zonedDateTimeToDate,
  type BusinessHours,
} from "@/lib/time-engine";

import type {
  MeetingParticipant,
  MeetingParticipantComfort,
  MeetingParticipantSlot,
  MeetingRecommendation,
  MeetingRecommendationQuality,
} from "../types";

const MINUTE_IN_MILLISECONDS =
  60_000;

const DEFAULT_HORIZON_HOURS =
  24;

const REASONABLE_START_HOUR =
  7;

const REASONABLE_END_HOUR =
  21;

type FindMeetingRecommendationsOptions = {
  participants:
    MeetingParticipant[];

  date: string;

  intervalMinutes: number;

  durationMinutes: number;

  limit: number;

  allowCompromise: boolean;

  horizonHours?: number;
};

function getDecimalHour(
  hour: number,
  minute: number,
): number {
  return (
    hour +
    minute / 60
  );
}

function getBusinessHoursCenter(
  businessHours:
    BusinessHours,
): number {
  return (
    businessHours.startHour +
    businessHours.endHour
  ) / 2;
}

function getParticipantComfort(
  hour: number,
  minute: number,
  businessHours:
    BusinessHours,
): MeetingParticipantComfort {
  const decimalHour =
    getDecimalHour(
      hour,
      minute,
    );

  if (
    decimalHour >=
      businessHours.startHour &&
    decimalHour <
      businessHours.endHour
  ) {
    return "ideal";
  }

  if (
    decimalHour >=
      REASONABLE_START_HOUR &&
    decimalHour <
      businessHours.startHour
  ) {
    return "early";
  }

  if (
    decimalHour >=
      businessHours.endHour &&
    decimalHour <
      REASONABLE_END_HOUR
  ) {
    return "late";
  }

  return "uncomfortable";
}

function getComfortPenalty(
  comfort:
    MeetingParticipantComfort,
): number {
  switch (comfort) {
    case "ideal":
      return 0;

    case "early":
    case "late":
      return 12;

    case "uncomfortable":
      return 35;
  }
}

function formatParticipantTime(
  instant: Date,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        timezone,

      hour:
        "numeric",

      minute:
        "2-digit",

      hour12:
        true,
    },
  ).format(
    instant,
  );
}

function formatParticipantDate(
  instant: Date,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        timezone,

      weekday:
        "short",

      month:
        "short",

      day:
        "numeric",
    },
  ).format(
    instant,
  );
}

function createParticipantSlot(
  instant: Date,
  participant:
    MeetingParticipant,
): MeetingParticipantSlot {
  const localParts =
    getLocalBusinessParts(
      instant,
      participant.city
        .timezone.name,
    );

  const insideBusinessHours =
    isInsideBusinessHours(
      instant,
      participant.city
        .timezone.name,
      participant.businessHours,
    );

  return {
    participantId:
      participant.id,

    cityName:
      participant.city.name,

    countryName:
      participant.city
        .country.name,

    countryCode:
      participant.city
        .country.iso2,

    timezone:
      participant.city
        .timezone.name,

    localTime:
      formatParticipantTime(
        instant,
        participant.city
          .timezone.name,
      ),

    localDate:
      formatParticipantDate(
        instant,
        participant.city
          .timezone.name,
      ),

    hour:
      localParts.hour,

    minute:
      localParts.minute,

    weekday:
      localParts.weekday,

    comfort:
      getParticipantComfort(
        localParts.hour,
        localParts.minute,
        participant.businessHours,
      ),

    isInsideBusinessHours:
      insideBusinessHours,
  };
}

function calculateRecommendationScore(
  participantSlots:
    MeetingParticipantSlot[],
  participants:
    MeetingParticipant[],
): number {
  if (
    participantSlots.length ===
    0
  ) {
    return 0;
  }

  let totalPenalty =
    0;

  for (
    const participantSlot
    of participantSlots
  ) {
    const participant =
      participants.find(
        (candidate) =>
          candidate.id ===
          participantSlot.participantId,
      );

    if (!participant) {
      totalPenalty +=
        50;

      continue;
    }

    const decimalHour =
      getDecimalHour(
        participantSlot.hour,
        participantSlot.minute,
      );

    const businessCenter =
      getBusinessHoursCenter(
        participant.businessHours,
      );

    const distancePenalty =
      Math.abs(
        decimalHour -
          businessCenter,
      ) * 2;

    const comfortPenalty =
      getComfortPenalty(
        participantSlot.comfort,
      );

    totalPenalty +=
      distancePenalty +
      comfortPenalty;
  }

  const averagePenalty =
    totalPenalty /
    participantSlots.length;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          averagePenalty,
      ),
    ),
  );
}

function getRecommendationQuality(
  score: number,
): MeetingRecommendationQuality {
  if (score >= 90) {
    return "excellent";
  }

  if (score >= 75) {
    return "good";
  }

  if (score >= 55) {
    return "acceptable";
  }

  return "difficult";
}

function createRecommendationId(
  instant: Date,
): string {
  return instant
    .toISOString()
    .replace(
      /[:.]/g,
      "-",
    );
}

function isMeetingDurationInsideHours(
  instant: Date,
  participant:
    MeetingParticipant,
  durationMinutes: number,
): boolean {
  const meetingEnd =
    new Date(
      instant.getTime() +
        durationMinutes *
          MINUTE_IN_MILLISECONDS,
    );

  /*
   * On vérifie le début et la dernière
   * minute de la réunion.
   */
  const lastMeetingMinute =
    new Date(
      meetingEnd.getTime() -
        MINUTE_IN_MILLISECONDS,
    );

  return (
    isInsideBusinessHours(
      instant,
      participant.city
        .timezone.name,
      participant.businessHours,
    ) &&
    isInsideBusinessHours(
      lastMeetingMinute,
      participant.city
        .timezone.name,
      participant.businessHours,
    )
  );
}

function createDateAnchor(
  date: string,
  firstParticipant:
    MeetingParticipant,
): Date | null {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      date,
    )
  ) {
    return null;
  }

  return zonedDateTimeToDate(
    `${date}T00:00`,
    firstParticipant.city
      .timezone.name,
  );
}

export function findMultiCityMeetingRecommendations({
  participants,
  date,
  intervalMinutes,
  durationMinutes,
  limit,
  allowCompromise,
  horizonHours =
    DEFAULT_HORIZON_HOURS,
}: FindMeetingRecommendationsOptions): MeetingRecommendation[] {
  if (
    participants.length < 2 ||
    intervalMinutes <= 0 ||
    durationMinutes <= 0 ||
    limit <= 0 ||
    horizonHours <= 0
  ) {
    return [];
  }

  const startInstant =
    createDateAnchor(
      date,
      participants[0],
    );

  if (!startInstant) {
    return [];
  }

  const totalSlots =
    Math.ceil(
      (
        horizonHours *
        60
      ) /
        intervalMinutes,
    );

  const recommendations:
    MeetingRecommendation[] = [];

  for (
    let slotIndex = 0;
    slotIndex <
    totalSlots;
    slotIndex += 1
  ) {
    const instant =
      new Date(
        startInstant.getTime() +
          slotIndex *
            intervalMinutes *
            MINUTE_IN_MILLISECONDS,
      );

    const participantSlots =
      participants.map(
        (participant) =>
          createParticipantSlot(
            instant,
            participant,
          ),
      );

    const participantDurationStates =
      participants.map(
        (participant) =>
          isMeetingDurationInsideHours(
            instant,
            participant,
            durationMinutes,
          ),
      );

    const workingParticipants =
      participantDurationStates.filter(
        Boolean,
      ).length;

    const isStrictOverlap =
      workingParticipants ===
      participants.length;

    if (
      !isStrictOverlap &&
      !allowCompromise
    ) {
      continue;
    }

    const hasUncomfortableParticipant =
      participantSlots.some(
        (participantSlot) =>
          participantSlot.comfort ===
          "uncomfortable",
      );

    if (
      !isStrictOverlap &&
      hasUncomfortableParticipant
    ) {
      continue;
    }

    const score =
      calculateRecommendationScore(
        participantSlots,
        participants,
      );

    recommendations.push({
      id:
        createRecommendationId(
          instant,
        ),

      instant,

      participants:
        participantSlots,

      score,

      quality:
        getRecommendationQuality(
          score,
        ),

      isStrictOverlap,

      workingParticipants,

      totalParticipants:
        participants.length,
    });
  }

  return recommendations
    .sort(
      (
        firstRecommendation,
        secondRecommendation,
      ) => {
        if (
          firstRecommendation
            .isStrictOverlap !==
          secondRecommendation
            .isStrictOverlap
        ) {
          return firstRecommendation
            .isStrictOverlap
            ? -1
            : 1;
        }

        if (
          firstRecommendation.score !==
          secondRecommendation.score
        ) {
          return (
            secondRecommendation.score -
            firstRecommendation.score
          );
        }

        return (
          firstRecommendation.instant
            .getTime() -
          secondRecommendation.instant
            .getTime()
        );
      },
    )
    .slice(
      0,
      limit,
    );
}

export const meetingPlannerService = {
  findRecommendations:
    findMultiCityMeetingRecommendations,
};

export default meetingPlannerService;