"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  CitySearchResult,
} from "@/features/city-search/types";

import type {
  MeetingParticipant,
  MeetingPlannerSettings,
} from "../types";

import {
  createMeetingShareUrl,
  createSharedParticipant,
  parseMeetingShareParams,
} from "../services/meetingPlannerShareService";

import {
  useToast,
} from "@/components/ui/toast";


type UseMeetingPlannerShareOptions = {
  participants:
    MeetingParticipant[];

  settings:
    MeetingPlannerSettings;

  replacePlannerState: (
    values: {
      participants:
        MeetingParticipant[];

      settings:
        Partial<
          MeetingPlannerSettings
        >;
    },
  ) => void;
};

type ResolveCitiesResponse = {
  results:
    CitySearchResult[];

  count: number;

  error?: string;
};

type UseMeetingPlannerShareReturn = {
  isRestoring: boolean;

  restoreError:
    string | null;

  copied: boolean;

  copyShareLink: (
    selectedSlot?:
      Date | null,
  ) => Promise<void>;
};

function copyTextFallback(
  value: string,
): boolean {
  const textArea =
    document.createElement(
      "textarea",
    );

  textArea.value =
    value;

  textArea.setAttribute(
    "readonly",
    "",
  );

  textArea.style.position =
    "fixed";

  textArea.style.left =
    "-9999px";

  textArea.style.opacity =
    "0";

  document.body.appendChild(
    textArea,
  );

  textArea.select();

  let copied =
    false;

  try {
    copied =
      document.execCommand(
        "copy",
      );
  } catch {
    copied =
      false;
  }

  textArea.remove();

  return copied;
}

export default function useMeetingPlannerShare({
  participants,
  settings,
  replacePlannerState,
}: UseMeetingPlannerShareOptions):
  UseMeetingPlannerShareReturn {
  const toast =
    useToast();

  const [
    isRestoring,
    setIsRestoring,
  ] = useState(true);

  const [
    restoreError,
    setRestoreError,
  ] = useState<
    string | null
  >(null);

  const [
    copied,
    setCopied,
  ] = useState(false);

  const copiedTimerRef =
    useRef<
      number | null
    >(null);

  /*
   * Restaure une configuration présente
   * dans l’URL au premier chargement.
   */
  useEffect(() => {
  let effectIsActive =
    true;

  const restoreTimer =
    window.setTimeout(
      async () => {
        const sharedState =
          parseMeetingShareParams(
            new URLSearchParams(
              window.location.search,
            ),
          );

        if (
          sharedState
            .participants
            .length === 0
        ) {
          if (
            effectIsActive
          ) {
            setIsRestoring(
              false,
            );
          }

          return;
        }

        try {
          const routeSlugs =
            sharedState
              .participants
              .map(
                (
                  participant,
                ) =>
                  participant
                    .routeSlug,
              );

          const searchParams =
            new URLSearchParams({
              cities:
                routeSlugs.join(
                  ",",
                ),
            });

          const response =
            await fetch(
              `/api/cities/resolve?${searchParams.toString()}`,
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },
              },
            );

          const data =
            (await response.json()) as
              ResolveCitiesResponse;

          if (
            !response.ok
          ) {
            throw new Error(
              data.error ??
                "Unable to restore this meeting.",
            );
          }

          if (
            !effectIsActive
          ) {
            return;
          }

          const cityMap =
            new Map(
              data.results.map(
                (city) => [
                  city.routeSlug,
                  city,
                ],
              ),
            );

          const restoredParticipants =
            sharedState
              .participants
              .map(
                (
                  sharedParticipant,
                ) => {
                  const city =
                    cityMap.get(
                      sharedParticipant
                        .routeSlug,
                    );

                  if (!city) {
                    return null;
                  }

                  return createSharedParticipant({
                    city,

                    businessHours:
                      sharedParticipant
                        .businessHours,
                  });
                },
              )
              .filter(
                (
                  participant,
                ): participant is MeetingParticipant =>
                  participant !==
                  null,
              );

          replacePlannerState({
            participants:
              restoredParticipants,

            settings:
              sharedState.settings,
          });

          toast.success(
            "Shared meeting restored",

            `${restoredParticipants.length} participant ${
              restoredParticipants.length ===
              1
                ? "city was"
                : "cities were"
            } loaded successfully.`,
          );
        } catch (
          error
        ) {
          if (
            !effectIsActive
          ) {
            return;
          }

          console.error(
            "[TimeInOne Meeting Share Restore]",
            error,
          );

          const errorMessage =
            error instanceof Error
              ? error.message
              : "TimeInOne could not restore the shared meeting.";

          setRestoreError(
            errorMessage,
          );

          toast.error(
            "Meeting restoration failed",
            errorMessage,
          );
        } finally {
          if (
            effectIsActive
          ) {
            setIsRestoring(
              false,
            );
          }
        }
      },
      0,
    );

  return () => {
    effectIsActive =
      false;

    window.clearTimeout(
      restoreTimer,
    );
  };
}, [
  replacePlannerState,
  toast,
]);

  /*
   * Synchronise automatiquement l’état
   * courant du planner avec l’URL.
   */
  useEffect(() => {
    if (
      isRestoring
    ) {
      return;
    }

    const updateTimer =
      window.setTimeout(
        () => {
          const shareUrl =
            createMeetingShareUrl({
              participants,
              settings,
            });

          const parsedUrl =
            new URL(
              shareUrl,
              window.location.origin,
            );

          window.history.replaceState(
            null,
            "",
            parsedUrl.pathname +
              parsedUrl.search,
          );
        },
        150,
      );

    return () => {
      window.clearTimeout(
        updateTimer,
      );
    };
  }, [
    isRestoring,
    participants,
    settings,
  ]);

  useEffect(() => {
    return () => {
      if (
        copiedTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          copiedTimerRef.current,
        );
      }
    };
  }, []);

  const copyShareLink =
    useCallback(
      async (
        selectedSlot:
          Date | null = null,
      ): Promise<void> => {
        const shareUrl =
          createMeetingShareUrl({
            participants,
            settings,
            selectedSlot,
          });

        let copySucceeded =
          false;

        try {
          if (
            navigator.clipboard &&
            window.isSecureContext
          ) {
            await navigator.clipboard.writeText(
              shareUrl,
            );

            copySucceeded =
              true;
          } else {
            copySucceeded =
              copyTextFallback(
                shareUrl,
              );
          }
        } catch (
          error
        ) {
          console.error(
            "[TimeInOne Meeting Share Copy]",
            error,
          );

          copySucceeded =
            copyTextFallback(
              shareUrl,
            );
        }

        if (
        !copySucceeded
        ) {
        toast.error(
            "Unable to copy link",
            "Your browser did not allow TimeInOne to access the clipboard.",
        );

        return;
        }

        setCopied(
          true,
        );

        toast.success(
        selectedSlot
            ? "Meeting slot copied"
            : "Planner link copied",

        selectedSlot
            ? "The selected meeting time is ready to share with your team."
            : "The complete meeting configuration was copied to your clipboard.",
        );

        if (
          copiedTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            copiedTimerRef.current,
          );
        }

        copiedTimerRef.current =
          window.setTimeout(
            () => {
              setCopied(
                false,
              );

              copiedTimerRef.current =
                null;
            },
            2_000,
          );
      },
      [
        participants,
        settings,
        toast,
        ],
    );

  return {
    isRestoring,
    restoreError,

    copied,

    copyShareLink,
  };
}