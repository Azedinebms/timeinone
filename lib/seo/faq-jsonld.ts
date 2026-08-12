import type {
  FaqItem,
} from "./faq";

import type {
  JsonLdObject,
} from "./jsonld";

export function createFaqJsonLd(
  items: FaqItem[],
): JsonLdObject {
  return {
    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    mainEntity:
      items.map(
        (item) => ({
          "@type":
            "Question",

          name:
            item.question,

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              item.answer,
          },
        }),
      ),
  };
}