import yaml from "js-yaml";

const pattern = /(^-{3}(?:\r\n|\r|\n)([\w\W]*?)-{3}(?:\r\n|\r|\n))?([\w\W]*)*/;

interface FrontmatterParseResult<T> {
  data: T;
  content: string;
}

export function parse<T>(input: string): FrontmatterParseResult<T> {
  const parsed: FrontmatterParseResult<T> = {
    data: {} as T,
    content: "",
  };

  const matches = input.match(pattern);

  if (matches && matches[2] !== undefined) {
    try {
      parsed.data = (yaml.load(matches[2]) || {}) as T;
    } catch (err) {
      throw err;
    }
  }

  if (matches && matches[3] !== undefined) {
    parsed.content = matches[3];
  }

  return parsed;
}
