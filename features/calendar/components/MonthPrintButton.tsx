"use client";

type MonthPrintButtonProps = {
  monthName: string;
  year: number;
};

export default function MonthPrintButton({
  monthName,
  year,
}: MonthPrintButtonProps) {
  function handlePrint() {
    const calendarElement =
      document.getElementById(
        "print-month-calendar",
      );

    if (
      !calendarElement
    ) {
      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=800",
      );

    if (
      !printWindow
    ) {
      return;
    }

    const styles =
      Array.from(
        document.querySelectorAll<
          HTMLStyleElement |
          HTMLLinkElement
        >(
          'style, link[rel="stylesheet"]',
        ),
      )
        .map(
          (
            node,
          ) =>
            node.outerHTML,
        )
        .join(
          "\n",
        );

    printWindow.document.write(`
      <!DOCTYPE html>

      <html lang="en">
        <head>
          <meta charset="utf-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <title>
            ${monthName} ${year} Calendar
          </title>

          ${styles}

          <style>
            @page {
              size: portrait;
              margin: 12mm;
            }

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }

            body {
              color: #0f172a;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
            }

            #print-root {
              width: 100%;
              max-width: 760px;
              margin: 0 auto;
            }

            #print-root article {
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              box-shadow: none !important;
              transform: none !important;
            }

            #print-root * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .print-only-title {
              margin-bottom: 24px;
              text-align: center;
            }

            .print-only-title h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 800;
            }

            .print-only-title p {
              margin: 6px 0 0;
              font-size: 12px;
              color: #64748b;
            }
          </style>
        </head>

        <body>
          <main id="print-root">
            <div class="print-only-title">
              <h1>
                ${monthName} ${year} Calendar
              </h1>

              <p>
                TimeInOne
              </p>
            </div>

            ${calendarElement.innerHTML}
          </main>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    window.setTimeout(
      () => {
        printWindow.print();

        printWindow.close();
      },
      500,
    );
  }

  return (
    <button
      type="button"
      onClick={
        handlePrint
      }
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M7 8V3h10v5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <rect
          x="6"
          y="14"
          width="12"
          height="7"
          rx="1"
        />

        <path
          d="M6 17H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="18"
          cy="11"
          r=".8"
          fill="currentColor"
          stroke="none"
        />
      </svg>

      Print {monthName} {year}
    </button>
  );
}