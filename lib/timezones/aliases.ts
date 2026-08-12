export const TIMEZONE_ALIASES: Record<
  string,
  string
> = {
  utc: "utc",
  "coordinated-universal-time": "utc",

  gmt: "gmt",
  "greenwich-mean-time": "gmt",

  pst: "pst",
  pdt: "pdt",
  mst: "mst",
  mdt: "mdt",
  cst: "cst",
  cdt: "cdt",
  est: "est",
  edt: "edt",

  cet: "cet",
  cest: "cest",
  eet: "eet",
  eest: "eest",

  jst: "jst",
  kst: "kst",

  ist: "ist-india",
  "ist-india": "ist-india",
  "india-standard-time": "ist-india",

  aest: "aest",
  aedt: "aedt",

  pt: "pacific-time",
  "pacific-time": "pacific-time",

  et: "eastern-time",
  "eastern-time": "eastern-time",

  "central-european-time":
    "central-european-time",
};