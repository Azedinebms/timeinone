import type { Metadata } from "next";

export type SeoInput = {
  title: string;
  description: string;

  path?: string;

  image?: string;

  noIndex?: boolean;

  keywords?: string[];

  openGraphType?:
    | "website"
    | "article";
};

export type SeoBuilder = (
  input: SeoInput,
) => Metadata;