"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type {
  CitySearchResult,
} from "@/features/city-search/types";

import {
  DEFAULT_BUSINESS_HOURS,
  type BusinessHours,
} from "@/lib/time-engine";

import {
  findMultiCityMeetingRecommendations,
} from "../services/meetingPlannerService";

import {
  DEFAULT_MEETING_DURATION_MINUTES,
  DEFAULT_MEETING_INTERVAL_MINUTES,
  MAX_MEETING_PARTICIPANTS,
  MIN_MEETING_PARTICIPANTS,
  type MeetingParticipant,
  type MeetingPlannerSettings,
  type MeetingPlannerState,
} from "../types";

function createDefaultDate():
  string {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1,
    ).padStart(
      2,
      "0",
    );

  const day =
    String(
      now.getDate(),
    ).padStart(
      2,
      "0",
    );

  return `${year}-${month}-${day}`;
}

function createParticipantId(
  city: CitySearchResult,
): string {
  return [
    city.routeSlug,
    city.id,
  ].join("-");
}

function createDefaultBusinessHours():
  BusinessHours {
  return {
    startHour:
      DEFAULT_BUSINESS_HOURS
        .startHour,

    endHour:
      DEFAULT_BUSINESS_HOURS
        .endHour,

    workingDays: [
      ...DEFAULT_BUSINESS_HOURS
        .workingDays,
    ],
  };
}

function normalizeParticipants(
  participants:
    MeetingParticipant[],
): MeetingParticipant[] {
  const uniqueRoutes =
    new Set<string>();

  return participants
    .filter(
      (participant) => {
        const routeSlug =
          participant.city
            .routeSlug;

        if (
          uniqueRoutes.has(
            routeSlug,
          )
        ) {
          return false;
        }

        uniqueRoutes.add(
          routeSlug,
        );

        return true;
      },
    )
    .slice(
      0,
      MAX_MEETING_PARTICIPANTS,
    );
}

const DEFAULT_SETTINGS:
  MeetingPlannerSettings = {
  date:
    createDefaultDate(),

  durationMinutes:
    DEFAULT_MEETING_DURATION_MINUTES,

  intervalMinutes:
    DEFAULT_MEETING_INTERVAL_MINUTES,

  allowCompromise:
    true,

  resultLimit:
    5,
};

export type UseMeetingPlannerReturn =
  MeetingPlannerState & {
    addParticipant: (
      city:
        CitySearchResult,
    ) => boolean;

    removeParticipant: (
      participantId:
        string,
    ) => void;

    updateParticipantBusinessHours: (
      participantId:
        string,
      businessHours:
        BusinessHours,
    ) => void;

    updateSettings: (
      values:
        Partial<MeetingPlannerSettings>,
    ) => void;

    clearParticipants:
      () => void;

    hasCity: (
      city:
        CitySearchResult,
    ) => boolean;

    replaceParticipants: (
      participants:
        MeetingParticipant[],
    ) => void;

    replacePlannerState: ({
      participants,
      settings,
    }: {
      participants:
        MeetingParticipant[];

      settings:
        Partial<
          MeetingPlannerSettings
        >;
    }) => void;
  };

export default function useMeetingPlanner():
  UseMeetingPlannerReturn {
  const [
    participants,
    setParticipants,
  ] = useState<
    MeetingParticipant[]
  >([]);

  const [
    settings,
    setSettings,
  ] = useState<
    MeetingPlannerSettings
  >(
    DEFAULT_SETTINGS,
  );

  const hasCity =
    useCallback(
      (
        city:
          CitySearchResult,
      ): boolean =>
        participants.some(
          (participant) =>
            participant.city
              .routeSlug ===
            city.routeSlug,
        ),
      [
        participants,
      ],
    );

  const addParticipant =
    useCallback(
      (
        city:
          CitySearchResult,
      ): boolean => {
        if (
          participants.length >=
            MAX_MEETING_PARTICIPANTS ||
          participants.some(
            (participant) =>
              participant.city
                .routeSlug ===
              city.routeSlug,
          )
        ) {
          return false;
        }

        const participant:
          MeetingParticipant = {
          id:
            createParticipantId(
              city,
            ),

          city,

          businessHours:
            createDefaultBusinessHours(),
        };

        setParticipants(
          (
            currentParticipants,
          ) => [
            ...currentParticipants,
            participant,
          ],
        );

        return true;
      },
      [
        participants,
      ],
    );

  const removeParticipant =
    useCallback(
      (
        participantId:
          string,
      ) => {
        setParticipants(
          (
            currentParticipants,
          ) =>
            currentParticipants.filter(
              (participant) =>
                participant.id !==
                participantId,
            ),
        );
      },
      [],
    );

  const updateParticipantBusinessHours =
    useCallback(
      (
        participantId:
          string,
        businessHours:
          BusinessHours,
      ) => {
        if (
          businessHours.startHour <
            0 ||
          businessHours.endHour >
            24 ||
          businessHours.startHour >=
            businessHours.endHour
        ) {
          return;
        }

        setParticipants(
          (
            currentParticipants,
          ) =>
            currentParticipants.map(
              (participant) =>
                participant.id ===
                participantId
                  ? {
                      ...participant,

                      businessHours: {
                        startHour:
                          businessHours
                            .startHour,

                        endHour:
                          businessHours
                            .endHour,

                        workingDays: [
                          ...businessHours
                            .workingDays,
                        ],
                      },
                    }
                  : participant,
            ),
        );
      },
      [],
    );

  const updateSettings =
    useCallback(
      (
        values:
          Partial<MeetingPlannerSettings>,
      ) => {
        setSettings(
          (
            currentSettings,
          ) => ({
            ...currentSettings,
            ...values,
          }),
        );
      },
      [],
    );

  const clearParticipants =
    useCallback(() => {
      setParticipants(
        [],
      );
    }, []);

  const replaceParticipants =
    useCallback(
      (
        newParticipants:
          MeetingParticipant[],
      ) => {
        setParticipants(
          normalizeParticipants(
            newParticipants,
          ),
        );
      },
      [],
    );

  const replacePlannerState =
    useCallback(
      ({
        participants:
          newParticipants,

        settings:
          newSettings,
      }: {
        participants:
          MeetingParticipant[];

        settings:
          Partial<
            MeetingPlannerSettings
          >;
      }) => {
        setParticipants(
          normalizeParticipants(
            newParticipants,
          ),
        );

        setSettings(
          (
            currentSettings,
          ) => ({
            ...currentSettings,
            ...newSettings,
          }),
        );
      },
      [],
    );

  const hasMinimumParticipants =
    participants.length >=
    MIN_MEETING_PARTICIPANTS;

  const participantLimitReached =
    participants.length >=
    MAX_MEETING_PARTICIPANTS;

  const canCalculate =
    hasMinimumParticipants &&
    Boolean(
      settings.date,
    );

  const recommendations =
    useMemo(
      () => {
        if (
          !canCalculate
        ) {
          return [];
        }

        return findMultiCityMeetingRecommendations({
          participants,

          date:
            settings.date,

          durationMinutes:
            settings.durationMinutes,

          intervalMinutes:
            settings.intervalMinutes,

          allowCompromise:
            settings.allowCompromise,

          limit:
            settings.resultLimit,
        });
      },
      [
        canCalculate,
        participants,
        settings.allowCompromise,
        settings.date,
        settings.durationMinutes,
        settings.intervalMinutes,
        settings.resultLimit,
      ],
    );

  return {
    participants,
    settings,

    recommendations,

    canCalculate,

    hasMinimumParticipants,

    participantLimitReached,

    addParticipant,

    removeParticipant,

    updateParticipantBusinessHours,

    updateSettings,

    clearParticipants,

    hasCity,

    replaceParticipants,

    replacePlannerState,
  };
}