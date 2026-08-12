import type {
  TimezoneDefinition,
} from "./types";

export const TIMEZONE_DEFINITIONS:
  TimezoneDefinition[] = [
  {
    slug: "utc",
    abbreviation: "UTC",
    name: "Coordinated Universal Time",
    description:
      "The primary international time standard used to coordinate clocks worldwide.",
    kind: "fixed",
    offsetMinutes: 0,
    observesDst: false,
    regions: ["Worldwide"],
  },
  {
    slug: "gmt",
    abbreviation: "GMT",
    name: "Greenwich Mean Time",
    description:
      "A time standard based on the mean solar time at Greenwich, London.",
    kind: "fixed",
    offsetMinutes: 0,
    observesDst: false,
    regions: [
      "United Kingdom",
      "Iceland",
      "Western Africa",
    ],
  },
  {
    slug: "pst",
    abbreviation: "PST",
    name: "Pacific Standard Time",
    description:
      "The fixed standard-time offset used in parts of western North America.",
    kind: "fixed",
    offsetMinutes: -480,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "pdt",
    abbreviation: "PDT",
    name: "Pacific Daylight Time",
    description:
      "The daylight-saving offset used in parts of western North America.",
    kind: "fixed",
    offsetMinutes: -420,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "mst",
    abbreviation: "MST",
    name: "Mountain Standard Time",
    description:
      "The fixed standard-time offset used in parts of North America.",
    kind: "fixed",
    offsetMinutes: -420,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
      "Mexico",
    ],
  },
  {
    slug: "mdt",
    abbreviation: "MDT",
    name: "Mountain Daylight Time",
    description:
      "The daylight-saving offset used in parts of the Mountain Time region.",
    kind: "fixed",
    offsetMinutes: -360,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "cst",
    abbreviation: "CST",
    name: "Central Standard Time",
    description:
      "The North American Central Standard Time offset. CST can be ambiguous internationally.",
    kind: "fixed",
    offsetMinutes: -360,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
      "Mexico",
    ],
  },
  {
    slug: "cdt",
    abbreviation: "CDT",
    name: "Central Daylight Time",
    description:
      "The daylight-saving offset used in the North American Central Time region.",
    kind: "fixed",
    offsetMinutes: -300,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "est",
    abbreviation: "EST",
    name: "Eastern Standard Time",
    description:
      "The fixed standard-time offset used in parts of eastern North America.",
    kind: "fixed",
    offsetMinutes: -300,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "edt",
    abbreviation: "EDT",
    name: "Eastern Daylight Time",
    description:
      "The daylight-saving offset used in parts of eastern North America.",
    kind: "fixed",
    offsetMinutes: -240,
    observesDst: false,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "cet",
    abbreviation: "CET",
    name: "Central European Time",
    description:
      "The fixed Central European standard-time offset.",
    kind: "fixed",
    offsetMinutes: 60,
    observesDst: false,
    regions: [
      "France",
      "Germany",
      "Spain",
      "Italy",
      "Belgium",
    ],
  },
  {
    slug: "cest",
    abbreviation: "CEST",
    name: "Central European Summer Time",
    description:
      "The daylight-saving offset used in Central Europe.",
    kind: "fixed",
    offsetMinutes: 120,
    observesDst: false,
    regions: [
      "France",
      "Germany",
      "Spain",
      "Italy",
      "Belgium",
    ],
  },
  {
    slug: "eet",
    abbreviation: "EET",
    name: "Eastern European Time",
    description:
      "The fixed Eastern European standard-time offset.",
    kind: "fixed",
    offsetMinutes: 120,
    observesDst: false,
    regions: [
      "Greece",
      "Finland",
      "Romania",
      "Bulgaria",
    ],
  },
  {
    slug: "eest",
    abbreviation: "EEST",
    name: "Eastern European Summer Time",
    description:
      "The daylight-saving offset used in Eastern Europe.",
    kind: "fixed",
    offsetMinutes: 180,
    observesDst: false,
    regions: [
      "Greece",
      "Finland",
      "Romania",
      "Bulgaria",
    ],
  },
  {
    slug: "jst",
    abbreviation: "JST",
    name: "Japan Standard Time",
    description:
      "The standard time used throughout Japan.",
    kind: "fixed",
    offsetMinutes: 540,
    observesDst: false,
    regions: ["Japan"],
  },
  {
    slug: "kst",
    abbreviation: "KST",
    name: "Korea Standard Time",
    description:
      "The standard time used in South Korea.",
    kind: "fixed",
    offsetMinutes: 540,
    observesDst: false,
    regions: ["South Korea"],
  },
  {
    slug: "ist-india",
    abbreviation: "IST",
    name: "India Standard Time",
    description:
      "The standard time used throughout India. The abbreviation IST is internationally ambiguous.",
    kind: "fixed",
    offsetMinutes: 330,
    observesDst: false,
    regions: ["India"],
  },
  {
    slug: "aest",
    abbreviation: "AEST",
    name: "Australian Eastern Standard Time",
    description:
      "The standard-time offset used in eastern Australia.",
    kind: "fixed",
    offsetMinutes: 600,
    observesDst: false,
    regions: ["Australia"],
  },
  {
    slug: "aedt",
    abbreviation: "AEDT",
    name: "Australian Eastern Daylight Time",
    description:
      "The daylight-saving offset used in parts of eastern Australia.",
    kind: "fixed",
    offsetMinutes: 660,
    observesDst: false,
    regions: ["Australia"],
  },
  {
    slug: "pacific-time",
    abbreviation: "PT",
    name: "Pacific Time",
    description:
      "A seasonal North American time zone that automatically switches between PST and PDT.",
    kind: "iana",
    ianaTimezone: "America/Los_Angeles",
    observesDst: true,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "eastern-time",
    abbreviation: "ET",
    name: "Eastern Time",
    description:
      "A seasonal North American time zone that automatically switches between EST and EDT.",
    kind: "iana",
    ianaTimezone: "America/New_York",
    observesDst: true,
    regions: [
      "United States",
      "Canada",
    ],
  },
  {
    slug: "central-european-time",
    abbreviation: "CET/CEST",
    name: "Central European Time",
    description:
      "A seasonal European time zone that automatically switches between CET and CEST.",
    kind: "iana",
    ianaTimezone: "Europe/Paris",
    observesDst: true,
    regions: [
      "France",
      "Germany",
      "Spain",
      "Italy",
      "Belgium",
    ],
  },
];