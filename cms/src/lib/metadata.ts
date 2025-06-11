import type { MetadataProps } from "./types";

class StringBuilder {
  strings: string[];

  constructor() {
    this.strings = new Array();
    //this.append(value);
  }
  append(value: string) {
    if (value) {
      this.strings.push(value);
    }
  }
  clear() {
    this.strings.length = 0;
  }
  toString() {
    return this.strings.join("");
  }
}

export function formatMetadata(props: MetadataProps) {
  const sb = new StringBuilder();
  sb.append("---\n");

  // dynamically append all props as key/value yml pairs
  const keys = Object.keys(props).filter((key) =>
    isNaN(Number(key))
  ) as (keyof MetadataProps)[];

  for (const k of keys) {
    console.log(typeof k);

    const val = props[k];
    if (k == props[k]) continue;
    sb.append(`${k}: "${props[k]}"\n`);
  }
  //sb.append("draft: true\n");
  sb.append("---\n");
  return sb.toString();
}
