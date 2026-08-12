export function usesDST(
  timezone: string,
) {
  const january = new Date(2026, 0, 1);

  const july = new Date(2026, 6, 1);

  const janOffset = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    },
  ).format(january);

  const julOffset = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    },
  ).format(july);

  return janOffset !== julOffset;
}