export type TimeLocation = {
  id?: number;
  city: string;
  country: string;
  slug?: string;
  timezone: string;
};

export type TimeConversionResult = {
  instant: Date;
  from: TimeLocation;
  to: TimeLocation;
  fromTime: string;
  toTime: string;
  fromDate: string;
  toDate: string;
  differenceHours: number;
};

export type MeetingSlot = {
  instant: Date;
  fromHour: number;
  toHour: number;
  score: number;
};