import type {
  JsonLdObject,
} from "@/lib/seo/jsonld";

type JsonLdProps = {
  data:
    | JsonLdObject
    | JsonLdObject[];
};

function serializeJsonLd(
  data: JsonLdObject | JsonLdObject[],
) {
  return JSON.stringify(data).replace(
    /</g,
    "\\u003c",
  );
}

export default function JsonLd({
  data,
}: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  );
}