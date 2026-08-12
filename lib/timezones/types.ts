export type TimezoneKind =
  | "fixed"
  | "iana";

export type TimezoneDefinition = {
  slug: string;
  abbreviation: string;
  name: string;
  description: string;
  kind: TimezoneKind;

  offsetMinutes?: number;
  ianaTimezone?: string;

  observesDst: boolean;
  regions: string[];
};

export type TimezoneConversionInput = {
  localDateTime: string;
  fromTimezone: TimezoneDefinition;
  toTimezone: TimezoneDefinition;
};

export type TimezoneConversionSide = {
  slug: string;
  abbreviation: string;
  name: string;
  formattedTime: string;
  formattedDate: string;
  dateTimeInput: string;
  offsetMinutes: number;
  offsetLabel: string;
  ianaTimezone: string | null;
};

export type TimezoneConversionResult = {
  instant: Date;
  from: TimezoneConversionSide;
  to: TimezoneConversionSide;
  differenceMinutes: number;
  differenceLabel: string;
};