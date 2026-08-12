"use client";

import {
  useMemo,
  useState,
} from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import {
  useToast,
} from "@/components/ui/toast";

import type {
  CitySearchResult,
} from "@/features/city-search/types";

import useMeetingPlanner from "../hooks/useMeetingPlanner";
import useMeetingPlannerShare from "../hooks/useMeetingPlannerShare";

import type {
  MeetingRecommendation,
} from "../types";

import MeetingCityPicker from "./MeetingCityPicker";
import MeetingParticipants from "./MeetingParticipants";
import MeetingRecommendations from "./MeetingRecommendations";
import MeetingSelectedSlot from "./MeetingSelectedSlot";
import MeetingSettings from "./MeetingSettings";
import MeetingShareButton from "./MeetingShareButton";
import MeetingTimeline from "./MeetingTimeline";

const HIGHLIGHT_DURATION =
  2_000;

const SCROLL_DELAY =
  80;

export default function MeetingPlanner() {
  const {
    toast:
      showToast,

    success:
      showSuccess,

    warning:
      showWarning,

    error:
      showError,
  } = useToast();

  const {
    participants,
    settings,
    recommendations,

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
  } = useMeetingPlanner();

  const [
    highlightedParticipantId,
    setHighlightedParticipantId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    selectedRecommendationId,
    setSelectedRecommendationId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const {
    isRestoring,
    restoreError,
    copied,
    copyShareLink,
  } =
    useMeetingPlannerShare({
      participants,
      settings,
      replacePlannerState,
    });

  const selectedRecommendation =
    useMemo<
      MeetingRecommendation | null
    >(
      () =>
        recommendations.find(
          (
            recommendation,
          ) =>
            recommendation.id ===
            selectedRecommendationId,
        ) ??
        null,
      [
        recommendations,
        selectedRecommendationId,
      ],
    );

  function highlightParticipant(
    participantId:
      string,
  ): void {
    setHighlightedParticipantId(
      participantId,
    );

    window.setTimeout(
      () => {
        document
          .getElementById(
            `meeting-participant-${participantId}`,
          )
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "nearest",
          });
      },
      SCROLL_DELAY,
    );

    window.setTimeout(
      () => {
        setHighlightedParticipantId(
          (
            currentParticipantId,
          ) =>
            currentParticipantId ===
            participantId
              ? null
              : currentParticipantId,
        );
      },
      HIGHLIGHT_DURATION,
    );
  }

  function clearSelectedRecommendation():
    void {
    setSelectedRecommendationId(
      null,
    );
  }

  function handleCitySelect(
    city:
      CitySearchResult,
  ): boolean {
    if (
      hasCity(
        city,
      )
    ) {
      showWarning(
        "City already added",
        `${city.name} is already part of this meeting.`,
      );

      return false;
    }

    if (
      participantLimitReached
    ) {
      showWarning(
        "Participant limit reached",
        "You can add up to five cities to one meeting.",
      );

      return false;
    }

    const added =
      addParticipant(
        city,
      );

    if (
      !added
    ) {
      showError(
        "Unable to add city",
        `${city.name} could not be added to the meeting.`,
      );

      return false;
    }

    clearSelectedRecommendation();

    showSuccess(
      "City added",
      `${city.name}, ${city.country.name} was added to the meeting.`,
    );

    const participantId = [
      city.routeSlug,
      city.id,
    ].join(
      "-",
    );

    highlightParticipant(
      participantId,
    );

    return true;
  }

  function handleRemoveParticipant(
    participantId:
      string,
  ): void {
    const removedIndex =
      participants.findIndex(
        (
          participant,
        ) =>
          participant.id ===
          participantId,
      );

    if (
      removedIndex ===
      -1
    ) {
      return;
    }

    const removedParticipant =
      participants[
        removedIndex
      ];

    const participantsBeforeRemoval = [
      ...participants,
    ];

    removeParticipant(
      participantId,
    );

    clearSelectedRecommendation();

    showToast({
      title:
        `${removedParticipant.city.name} removed`,

      description:
        "The city was removed from this meeting.",

      variant:
        "info",

      duration:
        6_000,

      actionLabel:
        "Undo removal",

      onAction: () => {
        replaceParticipants(
          participantsBeforeRemoval,
        );

        highlightParticipant(
          removedParticipant.id,
        );

        showSuccess(
          "City restored",
          `${removedParticipant.city.name} was restored to the meeting.`,
        );
      },
    });
  }

  function handleClearParticipants():
    void {
    if (
      participants.length ===
      0
    ) {
      return;
    }

    const previousParticipants = [
      ...participants,
    ];

    clearParticipants();

    clearSelectedRecommendation();

    showToast({
      title:
        "All cities removed",

      description:
        `${previousParticipants.length} participant ${
          previousParticipants.length ===
          1
            ? "city was"
            : "cities were"
        } removed.`,

      variant:
        "warning",

      duration:
        6_000,

      actionLabel:
        "Undo clear",

      onAction: () => {
        replaceParticipants(
          previousParticipants,
        );

        const firstParticipant =
          previousParticipants[
            0
          ];

        if (
          firstParticipant
        ) {
          highlightParticipant(
            firstParticipant.id,
          );
        }

        showSuccess(
          "Participants restored",
          "All meeting cities were restored successfully.",
        );
      },
    });
  }

  function handleSettingsChange(
    values:
      Parameters<
        typeof updateSettings
      >[0],
  ): void {
    updateSettings(
      values,
    );

    clearSelectedRecommendation();
  }

  function handleBusinessHoursChange(
    participantId:
      string,

    businessHours:
      Parameters<
        typeof updateParticipantBusinessHours
      >[1],
  ): void {
    updateParticipantBusinessHours(
      participantId,
      businessHours,
    );

    clearSelectedRecommendation();
  }

  function handleSelectRecommendation(
    recommendation:
      MeetingRecommendation,
  ): void {
    setSelectedRecommendationId(
      recommendation.id,
    );

    showSuccess(
      "Meeting time selected",
      "Your final meeting summary is ready.",
    );

    window.setTimeout(
      () => {
        document
          .getElementById(
            "selected-meeting-slot",
          )
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
      },
      SCROLL_DELAY,
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* =========================================
          STEP 1 — PARTICIPANTS
      ========================================== */}

      <Card
        as="section"
        variant="default"
        padding="lg"
        className="w-full"
      >
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="primary"
                size="sm"
              >
                Step 1
              </Badge>

              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Participants
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Add participant cities
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
              Add the cities taking part
              in the meeting. You can
              customize local working
              hours for each participant.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={
                participantLimitReached
                  ? "warning"
                  : "neutral"
              }
              size="md"
            >
              {
                participants.length
              }
              /5 cities
            </Badge>

            {participants.length >
              0 && (
              <button
                type="button"
                onClick={
                  handleClearParticipants
                }
                className="h-10 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text-muted transition hover:border-danger/30 hover:bg-danger-soft hover:text-danger"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <MeetingCityPicker
            disabled={
              participantLimitReached
            }
            onSelect={
              handleCitySelect
            }
          />
        </div>

        <div className="mt-6">
          <MeetingParticipants
            participants={
              participants
            }
            highlightedParticipantId={
              highlightedParticipantId
            }
            onRemove={
              handleRemoveParticipant
            }
            onBusinessHoursChange={
              handleBusinessHoursChange
            }
          />
        </div>
      </Card>

      {/* =========================================
          STEP 2 — SETTINGS
      ========================================== */}

      <Card
        as="section"
        variant="default"
        padding="lg"
        className="w-full"
      >
        <div className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="accent"
                size="sm"
              >
                Step 2
              </Badge>

              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Settings
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Meeting settings
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
              Choose the date, duration
              and calculation interval.
            </p>
          </div>

          <MeetingShareButton
            copied={
              copied
            }
            disabled={
              participants.length ===
                0 ||
              isRestoring
            }
            onClick={() => {
              void copyShareLink();
            }}
          />
        </div>

        {isRestoring && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary-muted bg-primary-soft px-4 py-3 text-sm font-medium text-primary">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-muted border-t-primary" />

            Restoring shared meeting…
          </div>
        )}

        {restoreError && (
          <div className="mt-5 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            {
              restoreError
            }
          </div>
        )}

        <div className="mt-6">
          <MeetingSettings
            settings={
              settings
            }
            onChange={
              handleSettingsChange
            }
          />
        </div>
      </Card>

      {/* =========================================
          STEP 3 — RECOMMENDATIONS
      ========================================== */}

      <Card
        as="section"
        variant="default"
        padding="lg"
        className="w-full"
      >
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="success"
                size="sm"
              >
                Step 3
              </Badge>

              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Recommendations
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Best meeting times
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
              TimeInOne ranks the
              strongest meeting windows
              using working-hour overlap,
              comfort and fairness.
            </p>
          </div>

          {hasMinimumParticipants && (
            <Badge
              variant="neutral"
              size="md"
            >
              {
                recommendations.length
              }{" "}
              option
              {recommendations.length ===
              1
                ? ""
                : "s"}
            </Badge>
          )}
        </div>

        <div className="mt-6">
          <MeetingRecommendations
            recommendations={
              recommendations
            }
            hasMinimumParticipants={
              hasMinimumParticipants
            }
            durationMinutes={
              settings.durationMinutes
            }
            selectedRecommendationId={
              selectedRecommendationId
            }
            onSelectRecommendation={
              handleSelectRecommendation
            }
            onShareSlot={(
              instant,
            ) => {
              void copyShareLink(
                instant,
              );
            }}
          />
        </div>
      </Card>

      {/* =========================================
          STEP 4 — SELECTED RESULT
      ========================================== */}

      <Card
        id="selected-meeting-slot"
        as="section"
        variant="soft"
        padding="lg"
        className="w-full scroll-mt-24 border-primary-muted bg-primary-soft/40"
      >
        <div className="border-b border-primary-muted/70 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="primary"
              size="sm"
            >
              Step 4
            </Badge>

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Final selection
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
            Selected meeting time
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
            Confirm the selected
            meeting time, copy its
            details or export it to
            your calendar.
          </p>
        </div>

        <div className="mt-6">
          <MeetingSelectedSlot
            recommendation={
              selectedRecommendation
            }
            durationMinutes={
              settings.durationMinutes
            }
            onClear={
              clearSelectedRecommendation
            }
            onShare={(
              instant,
            ) => {
              void copyShareLink(
                instant,
              );
            }}
          />
        </div>
      </Card>

      {/* =========================================
          STEP 5 — TIMELINE
      ========================================== */}

      <Card
        as="section"
        variant="default"
        padding="lg"
        className="w-full"
      >
        <div className="border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="info"
              size="sm"
            >
              Step 5
            </Badge>

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Visual comparison
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
            Meeting timeline
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
            Compare local hours,
            comfort levels and
            recommended windows across
            all participant cities.
          </p>
        </div>

        <div className="mt-6">
          <MeetingTimeline
            participants={
              participants
            }
            date={
              settings.date
            }
            recommendations={
              recommendations
            }
            selectedRecommendationId={
              selectedRecommendationId
            }
            onSelectRecommendation={
              handleSelectRecommendation
            }
          />
        </div>
      </Card>
    </div>
  );
}