"use client";

import {
  useMemo,
  useState,
} from "react";

import AccordionItem from "@/components/ui/AccordionItem";
import Card from "@/components/ui/Card";
import FilterChip from "@/components/ui/FilterChip";
import SearchInput from "@/components/ui/SearchInput";

export type FaqItem = {
  id: string;

  category: string;

  question: string;

  answer: string;
};

type FaqAccordionProps = {
  items:
    FaqItem[];
};

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .normalize(
      "NFD",
    )
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}

export default function FaqAccordion({
  items,
}: FaqAccordionProps) {
  const [
    query,
    setQuery,
  ] = useState(
    "",
  );

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(
    "All",
  );

  const [
    openItemId,
    setOpenItemId,
  ] = useState<
    string | null
  >(
    items[0]?.id ??
      null,
  );

  const categories =
    useMemo(
      () => [
        "All",

        ...Array.from(
          new Set(
            items.map(
              (item) =>
                item.category,
            ),
          ),
        ),
      ],
      [
        items,
      ],
    );

  const filteredItems =
    useMemo(
      () => {
        const normalizedQuery =
          normalizeText(
            query,
          );

        return items.filter(
          (item) => {
            const categoryMatches =
              activeCategory ===
                "All" ||
              item.category ===
                activeCategory;

            if (
              !categoryMatches
            ) {
              return false;
            }

            if (
              !normalizedQuery
            ) {
              return true;
            }

            const searchableText =
              normalizeText(
                [
                  item.question,
                  item.answer,
                  item.category,
                ].join(
                  " ",
                ),
              );

            return searchableText.includes(
              normalizedQuery,
            );
          },
        );
      },
      [
        activeCategory,
        items,
        query,
      ],
    );

  function toggleItem(
    itemId: string,
  ): void {
    setOpenItemId(
      (
        currentItemId,
      ) =>
        currentItemId ===
        itemId
          ? null
          : itemId,
    );
  }

  function handleCategoryChange(
    category: string,
  ): void {
    setActiveCategory(
      category,
    );

    const firstMatchingItem =
      items.find(
        (item) =>
          category ===
            "All" ||
          item.category ===
            category,
      );

    setOpenItemId(
      firstMatchingItem?.id ??
        null,
    );
  }

  return (
    <div>
      <Card
        variant="elevated"
        padding="md"
      >
        <SearchInput
          label="Search the FAQ"
          value={query}
          onValueChange={
            setQuery
          }
          placeholder="Search time zones, meetings, privacy..."
        />

        <div
          className="mt-5 flex flex-wrap gap-2"
          aria-label="FAQ categories"
        >
          {categories.map(
            (category) => {
              const isActive =
                activeCategory ===
                category;

              return (
                <FilterChip
                  key={
                    category
                  }
                  active={
                    isActive
                  }
                  onClick={() => {
                    handleCategoryChange(
                      category,
                    );
                  }}
                >
                  {category}
                </FilterChip>
              );
            },
          )}
        </div>

        <p className="mt-4 text-xs leading-6 text-text-muted">
          Showing{" "}
          <span className="font-semibold text-text-primary">
            {
              filteredItems.length
            }
          </span>{" "}
          of{" "}
          <span className="font-semibold text-text-primary">
            {items.length}
          </span>{" "}
          answers
        </p>
      </Card>

      {filteredItems.length >
      0 ? (
        <div className="mt-6 space-y-3">
          {filteredItems.map(
            (
              item,
              index,
            ) => {
              const isOpen =
                openItemId ===
                item.id;

              return (
                <AccordionItem
                  key={
                    item.id
                  }
                  id={
                    `faq-${item.id}`
                  }
                  open={
                    isOpen
                  }
                  onToggle={() => {
                    toggleItem(
                      item.id,
                    );
                  }}
                  eyebrow={
                    item.category
                  }
                  title={
                    item.question
                  }
                  prefix={
                    String(
                      index +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )
                  }
                >
                  <p className="max-w-3xl text-sm leading-7 text-text-secondary sm:text-base">
                    {
                      item.answer
                    }
                  </p>
                </AccordionItem>
              );
            },
          )}
        </div>
      ) : (
        <Card
          variant="soft"
          padding="lg"
          className="mt-6 border-dashed text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-xl text-text-muted">
            ⌕
          </div>

          <p className="mt-4 font-semibold text-text-primary">
            No matching question
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Try another search term
            or select a different
            category.
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery(
                "",
              );

              setActiveCategory(
                "All",
              );

              setOpenItemId(
                items[0]?.id ??
                  null,
              );
            }}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft px-4 text-sm font-semibold text-primary outline-none transition hover:border-primary hover:bg-primary-muted focus-visible:ring-2 focus-visible:ring-primary"
          >
            Reset filters
          </button>
        </Card>
      )}
    </div>
  );
}