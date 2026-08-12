import type {
  CitySearchResult,
} from "@/features/city-search/types";

import type {
  BusinessHours,
} from "@/lib/time-engine";

export const MIN_MEETING_PARTICIPANTS =
  2;

export const MAX_MEETING_PARTICIPANTS =
  5;

export const DEFAULT_MEETING_DURATION_MINUTES =
  60;

export const DEFAULT_MEETING_INTERVAL_MINUTES =
  30;

export type MeetingParticipant = {
  id: string;

  city: CitySearchResult;

  businessHours: BusinessHours;
};

export type MeetingParticipantComfort =
  | "ideal"
  | "early"
  | "late"
  | "uncomfortable";

export type MeetingParticipantSlot = {
  participantId: string;

  cityName: string;
  countryName: string;
  countryCode: string;
  timezone: string;

  localTime: string;
  localDate: string;

  hour: number;
  minute: number;
  weekday: number;

  comfort:
    MeetingParticipantComfort;

  isInsideBusinessHours:
    boolean;
};

export type MeetingRecommendationQuality =
  | "excellent"
  | "good"
  | "acceptable"
  | "difficult";

export type MeetingRecommendation = {
  id: string;

  instant: Date;

  participants:
    MeetingParticipantSlot[];

  score: number;

  quality:
    MeetingRecommendationQuality;

  isStrictOverlap: boolean;

  workingParticipants: number;
  totalParticipants: number;
};

export type MeetingPlannerSettings = {
  date: string;

  durationMinutes: number;
  intervalMinutes: number;

  allowCompromise: boolean;

  resultLimit: number;
};

export type MeetingPlannerState = {
  participants:
    MeetingParticipant[];

  settings:
    MeetingPlannerSettings;

  recommendations:
    MeetingRecommendation[];

  canCalculate: boolean;

  hasMinimumParticipants:
    boolean;

  participantLimitReached:
    boolean;
};