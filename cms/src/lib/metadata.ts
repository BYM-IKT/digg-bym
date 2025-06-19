import { StringBuilder } from "./stringbuilder";
import type { MetadataProps } from "./types";

export function formatMetadata(props: MetadataProps) {
  const sb = new StringBuilder();
  sb.append("---\n");

  // dynamically append all props as key/value yml pairs
  const keys = Object.keys(props).filter((key) =>
    isNaN(Number(key))
  ) as (keyof MetadataProps)[];

  for (const k of keys) {
    let val = props[k];

    if (val === "true" || val === "false") {
      val = Boolean(val);
    }
    // legger til "" rundt tekst hvis det er en string
    const formatValue = typeof val === "boolean" ? val : `"${val}"`;

    if (k == val) continue;
    sb.append(`${k}: ${formatValue}\n`);
  }
  //sb.append("draft: true\n");
  sb.append("---\n");
  return sb.toString();
}
