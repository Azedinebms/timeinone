import {
  convertTimezoneTime,
  getAllTimezones,
  getOffsetSeoPairs,
  getSelectedOffsetTimezones,
  resolveTimezone,
  type TimezoneDefinition,
} from "../lib/timezones";

type AuditIssueLevel =
  | "error"
  | "warning";

type AuditIssue = {
  level: AuditIssueLevel;
  category: string;
  message: string;
};

type AuditSummary = {
  predefinedTimezones: number;
  selectedOffsets: number;
  predefinedPairs: number;
  offsetSeoPairs: number;
  detailUrls: number;
  converterUrls: number;
  totalUrls: number;
  errors: number;
  warnings: number;
};

const TEST_LOCAL_DATE_TIME =
  "2026-07-15T12:00";

const issues: AuditIssue[] = [];

function addError(
  category: string,
  message: string,
) {
  issues.push({
    level: "error",
    category,
    message,
  });
}

function addWarning(
  category: string,
  message: string,
) {
  issues.push({
    level: "warning",
    category,
    message,
  });
}

function createPairKey(
  fromSlug: string,
  toSlug: string,
) {
  return `${fromSlug}::${toSlug}`;
}

function createDetailUrl(
  timezone: TimezoneDefinition,
) {
  return `/timezone/${timezone.slug}`;
}

function createConverterUrl(
  fromTimezone: TimezoneDefinition,
  toTimezone: TimezoneDefinition,
) {
  return (
    `/timezone/${fromTimezone.slug}` +
    `-to-${toTimezone.slug}`
  );
}

function isValidSlug(slug: string) {
  return (
    slug.length > 0 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      slug,
    )
  );
}

function validateTimezoneDefinition(
  timezone: TimezoneDefinition,
  source: string,
) {
  if (!isValidSlug(timezone.slug)) {
    addError(
      "Invalid slug",
      `${source}: "${timezone.slug}" is not a valid canonical slug.`,
    );
  }

  if (!timezone.abbreviation.trim()) {
    addError(
      "Missing abbreviation",
      `${source}: ${timezone.slug} has no abbreviation.`,
    );
  }

  if (!timezone.name.trim()) {
    addError(
      "Missing name",
      `${source}: ${timezone.slug} has no name.`,
    );
  }

  if (!timezone.description.trim()) {
    addWarning(
      "Missing description",
      `${source}: ${timezone.slug} has no useful description.`,
    );
  }

  if (timezone.regions.length === 0) {
    addWarning(
      "Missing regions",
      `${source}: ${timezone.slug} has no associated region.`,
    );
  }

  if (timezone.kind === "fixed") {
    if (
      typeof timezone.offsetMinutes !==
      "number"
    ) {
      addError(
        "Missing fixed offset",
        `${source}: ${timezone.slug} is fixed but has no offsetMinutes.`,
      );
    }

    if (timezone.ianaTimezone) {
      addWarning(
        "Unexpected IANA zone",
        `${source}: ${timezone.slug} is fixed but also defines ${timezone.ianaTimezone}.`,
      );
    }
  }

  if (timezone.kind === "iana") {
    if (!timezone.ianaTimezone) {
      addError(
        "Missing IANA zone",
        `${source}: ${timezone.slug} is seasonal but has no ianaTimezone.`,
      );
    }

    if (
      typeof timezone.offsetMinutes ===
      "number"
    ) {
      addWarning(
        "Unexpected fixed offset",
        `${source}: ${timezone.slug} is IANA-based but also defines offsetMinutes.`,
      );
    }
  }

  if (
    typeof timezone.offsetMinutes ===
      "number" &&
    (
      timezone.offsetMinutes < -720 ||
      timezone.offsetMinutes > 840
    )
  ) {
    addError(
      "Offset outside range",
      `${source}: ${timezone.slug} uses ${timezone.offsetMinutes} minutes.`,
    );
  }
}

function auditUniqueSlugs(
  timezones: TimezoneDefinition[],
  source: string,
) {
  const slugCounts =
    new Map<string, number>();

  for (const timezone of timezones) {
    slugCounts.set(
      timezone.slug,
      (
        slugCounts.get(
          timezone.slug,
        ) ?? 0
      ) + 1,
    );
  }

  for (
    const [
      slug,
      count,
    ] of slugCounts
  ) {
    if (count > 1) {
      addError(
        "Duplicate slug",
        `${source}: "${slug}" appears ${count} times.`,
      );
    }
  }
}

function auditResolver(
  timezones: TimezoneDefinition[],
) {
  for (const timezone of timezones) {
    const resolved =
      resolveTimezone(
        timezone.slug,
      );

    if (!resolved) {
      addError(
        "Resolver failure",
        `resolveTimezone("${timezone.slug}") returned null.`,
      );

      continue;
    }

    if (
      resolved.slug !==
      timezone.slug
    ) {
      addError(
        "Canonical mismatch",
        `${timezone.slug} resolves to ${resolved.slug}.`,
      );
    }
  }
}

function auditKnownAliases() {
  const aliasTests = [
    {
      input: "UTC",
      expected: "utc",
    },
    {
      input:
        "coordinated universal time",
      expected: "utc",
    },
    {
      input: "GMT",
      expected: "gmt",
    },
    {
      input: "PST",
      expected: "pst",
    },
    {
      input: "PT",
      expected: "pacific-time",
    },
    {
      input: "ET",
      expected: "eastern-time",
    },
    {
      input: "IST",
      expected: "ist-india",
    },
    {
      input: "UTC+05:30",
      expected: "utc-plus-5-30",
    },
    {
      input: "GMT-03:30",
      expected: "gmt-minus-3-30",
    },
    {
      input: "utc_plus_1",
      expected: "utc-plus-1",
    },
  ];

  for (const test of aliasTests) {
    const resolved =
      resolveTimezone(
        test.input,
      );

    if (!resolved) {
      addError(
        "Alias failure",
        `"${test.input}" could not be resolved.`,
      );

      continue;
    }

    if (
      resolved.slug !==
      test.expected
    ) {
      addError(
        "Alias mismatch",
        `"${test.input}" resolved to "${resolved.slug}" instead of "${test.expected}".`,
      );
    }
  }
}

function auditInvalidOffsets() {
  const invalidValues = [
    "utc-plus-15",
    "utc-minus-13",
    "utc-plus-5-20",
    "gmt-plus-25",
    "gmt-minus-14",
    "utc-plus-5-60",
    "utc-plus",
    "utc-minus",
    "utc-plus-five",
  ];

  for (const value of invalidValues) {
    const resolved =
      resolveTimezone(value);

    if (resolved) {
      addError(
        "Invalid offset accepted",
        `"${value}" resolved to "${resolved.slug}".`,
      );
    }
  }
}

function auditZeroCanonicalization() {
  const zeroAliases = [
    {
      input: "utc-plus-0",
      expected: "utc",
    },
    {
      input: "utc-minus-0",
      expected: "utc",
    },
    {
      input: "gmt-plus-0",
      expected: "gmt",
    },
    {
      input: "gmt-minus-0",
      expected: "gmt",
    },
  ];

  for (const test of zeroAliases) {
    const resolved =
      resolveTimezone(
        test.input,
      );

    if (!resolved) {
      addError(
        "Zero-offset failure",
        `"${test.input}" could not be resolved.`,
      );

      continue;
    }

    if (
      resolved.slug !==
      test.expected
    ) {
      addError(
        "Zero canonical mismatch",
        `"${test.input}" resolves to "${resolved.slug}" instead of "${test.expected}".`,
      );
    }
  }
}

function auditConversion(
  fromTimezone: TimezoneDefinition,
  toTimezone: TimezoneDefinition,
) {
  const result =
    convertTimezoneTime({
      localDateTime:
        TEST_LOCAL_DATE_TIME,

      fromTimezone,
      toTimezone,
    });

  if (!result) {
    addError(
      "Conversion failure",
      `${fromTimezone.slug} → ${toTimezone.slug} returned null.`,
    );

    return;
  }

  if (
    Number.isNaN(
      result.instant.getTime(),
    )
  ) {
    addError(
      "Invalid instant",
      `${fromTimezone.slug} → ${toTimezone.slug} produced an invalid date.`,
    );
  }

  const expectedDifference =
    result.to.offsetMinutes -
    result.from.offsetMinutes;

  if (
    result.differenceMinutes !==
    expectedDifference
  ) {
    addError(
      "Difference mismatch",
      `${fromTimezone.slug} → ${toTimezone.slug}: expected ${expectedDifference}, received ${result.differenceMinutes}.`,
    );
  }

  if (
    !result.from.formattedTime ||
    !result.to.formattedTime
  ) {
    addError(
      "Missing formatted time",
      `${fromTimezone.slug} → ${toTimezone.slug} has an empty formatted time.`,
    );
  }

  const reverseResult =
    convertTimezoneTime({
      localDateTime:
        result.to.dateTimeInput,

      fromTimezone:
        toTimezone,

      toTimezone:
        fromTimezone,
    });

  if (!reverseResult) {
    addError(
      "Reverse conversion failure",
      `${toTimezone.slug} → ${fromTimezone.slug} returned null.`,
    );

    return;
  }

  const instantDifference =
    Math.abs(
      reverseResult.instant.getTime() -
      result.instant.getTime(),
    );

  /*
   * Une tolérance d'une minute couvre
   * les secondes supprimées par
   * datetime-local.
   */
  if (
    instantDifference >
    60 * 1000
  ) {
    addError(
      "Round-trip mismatch",
      `${fromTimezone.slug} → ${toTimezone.slug} → ${fromTimezone.slug} differs by ${instantDifference} ms.`,
    );
  }
}

function auditAllPredefinedPairs(
  timezones: TimezoneDefinition[],
) {
  let pairCount = 0;

  for (
    const fromTimezone of timezones
  ) {
    for (
      const toTimezone of timezones
    ) {
      if (
        fromTimezone.slug ===
        toTimezone.slug
      ) {
        continue;
      }

      pairCount += 1;

      auditConversion(
        fromTimezone,
        toTimezone,
      );
    }
  }

  return pairCount;
}

function auditOffsetSeoPairs() {
  const pairs =
    getOffsetSeoPairs();

  const usedPairs =
    new Set<string>();

  for (const pair of pairs) {
    const key =
      createPairKey(
        pair.fromTimezone.slug,
        pair.toTimezone.slug,
      );

    if (usedPairs.has(key)) {
      addError(
        "Duplicate SEO pair",
        `${pair.fromTimezone.slug} → ${pair.toTimezone.slug} appears more than once.`,
      );

      continue;
    }

    usedPairs.add(key);

    if (
      pair.fromTimezone.slug ===
      pair.toTimezone.slug
    ) {
      addError(
        "Self conversion",
        `${pair.fromTimezone.slug} points to itself.`,
      );
    }

    auditConversion(
      pair.fromTimezone,
      pair.toTimezone,
    );
  }

  return pairs;
}

function calculateSitemapUrls({
  predefinedTimezones,
  selectedOffsets,
  predefinedPairs,
  offsetSeoPairs,
}: {
  predefinedTimezones:
    TimezoneDefinition[];

  selectedOffsets:
    TimezoneDefinition[];

  predefinedPairs: number;

  offsetSeoPairs: ReturnType<
    typeof getOffsetSeoPairs
  >;
}) {
  const detailUrls =
    new Set<string>();

  const converterUrls =
    new Set<string>();

  for (
    const timezone of [
      ...predefinedTimezones,
      ...selectedOffsets,
    ]
  ) {
    detailUrls.add(
      createDetailUrl(
        timezone,
      ),
    );
  }

  for (
    const fromTimezone of
      predefinedTimezones
  ) {
    for (
      const toTimezone of
        predefinedTimezones
    ) {
      if (
        fromTimezone.slug ===
        toTimezone.slug
      ) {
        continue;
      }

      converterUrls.add(
        createConverterUrl(
          fromTimezone,
          toTimezone,
        ),
      );
    }
  }

  for (
    const pair of offsetSeoPairs
  ) {
    converterUrls.add(
      createConverterUrl(
        pair.fromTimezone,
        pair.toTimezone,
      ),
    );
  }

  if (
    predefinedPairs >
    converterUrls.size
  ) {
    addWarning(
      "URL deduplication",
      `${predefinedPairs} predefined pairs produced only ${converterUrls.size} unique converter URLs after combining all catalogs.`,
    );
  }

  return {
    detailUrls,
    converterUrls,
  };
}

function printIssues() {
  const errors =
    issues.filter(
      (issue) =>
        issue.level === "error",
    );

  const warnings =
    issues.filter(
      (issue) =>
        issue.level === "warning",
    );

  if (errors.length > 0) {
    console.log(
      "\n❌ Errors\n",
    );

    for (const issue of errors) {
      console.log(
        `- [${issue.category}] ${issue.message}`,
      );
    }
  }

  if (warnings.length > 0) {
    console.log(
      "\n⚠️ Warnings\n",
    );

    for (
      const issue of warnings
    ) {
      console.log(
        `- [${issue.category}] ${issue.message}`,
      );
    }
  }

  if (
    errors.length === 0 &&
    warnings.length === 0
  ) {
    console.log(
      "\n✅ No errors or warnings found.",
    );
  }
}

function printSummary(
  summary: AuditSummary,
) {
  console.log(
    "\n────────────────────────────────────",
  );

  console.log(
    "TimeInOne TIMEZONE AUDIT",
  );

  console.log(
    "────────────────────────────────────",
  );

  console.log(
    `Predefined time zones : ${summary.predefinedTimezones}`,
  );

  console.log(
    `Selected offsets      : ${summary.selectedOffsets}`,
  );

  console.log(
    `Predefined pairs      : ${summary.predefinedPairs}`,
  );

  console.log(
    `Offset SEO pairs      : ${summary.offsetSeoPairs}`,
  );

  console.log(
    `Detail URLs           : ${summary.detailUrls}`,
  );

  console.log(
    `Converter URLs        : ${summary.converterUrls}`,
  );

  console.log(
    `Total timezone URLs   : ${summary.totalUrls}`,
  );

  console.log(
    `Errors                : ${summary.errors}`,
  );

  console.log(
    `Warnings              : ${summary.warnings}`,
  );

  console.log(
    "────────────────────────────────────",
  );
}

function runAudit() {
  console.log(
    "Starting TimeInOne Timezone audit...",
  );

  const predefinedTimezones =
    getAllTimezones();

  const selectedOffsets =
    getSelectedOffsetTimezones();

  for (
    const timezone of
      predefinedTimezones
  ) {
    validateTimezoneDefinition(
      timezone,
      "Predefined time zone",
    );
  }

  for (
    const timezone of
      selectedOffsets
  ) {
    validateTimezoneDefinition(
      timezone,
      "Selected offset",
    );
  }

  auditUniqueSlugs(
    predefinedTimezones,
    "Predefined time zones",
  );

  auditUniqueSlugs(
    selectedOffsets,
    "Selected offsets",
  );

  auditResolver(
    predefinedTimezones,
  );

  auditResolver(
    selectedOffsets,
  );

  auditKnownAliases();
  auditInvalidOffsets();
  auditZeroCanonicalization();

  const predefinedPairs =
    auditAllPredefinedPairs(
      predefinedTimezones,
    );

  const offsetSeoPairs =
    auditOffsetSeoPairs();

  const {
    detailUrls,
    converterUrls,
  } = calculateSitemapUrls({
    predefinedTimezones,
    selectedOffsets,
    predefinedPairs,
    offsetSeoPairs,
  });

  const errors =
    issues.filter(
      (issue) =>
        issue.level === "error",
    ).length;

  const warnings =
    issues.filter(
      (issue) =>
        issue.level === "warning",
    ).length;

  const summary: AuditSummary = {
    predefinedTimezones:
      predefinedTimezones.length,

    selectedOffsets:
      selectedOffsets.length,

    predefinedPairs,

    offsetSeoPairs:
      offsetSeoPairs.length,

    detailUrls:
      detailUrls.size,

    converterUrls:
      converterUrls.size,

    totalUrls:
      detailUrls.size +
      converterUrls.size,

    errors,
    warnings,
  };

  printIssues();
  printSummary(summary);

  if (errors > 0) {
    console.error(
      "\n❌ Timezone audit failed.",
    );

    process.exitCode = 1;

    return;
  }

  console.log(
    "\n✅ Timezone audit passed successfully.",
  );
}

runAudit();