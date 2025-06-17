import { marked } from "marked";
import { parseFrontmatter } from "../lib/frontmatter-parse";

export type CmsMetadata = {
  type: number;
  draft: boolean;
  title: string;
  author: string;
  publishedAt: string;
  summary: string;
  slug: string;
  mainImageUrl?: string;
  mainImageCaption?: string;

  elementsPerRow?: number;
};

export type CmsPost = {
  frontmatter: CmsMetadata;
  html: string;
};
export const parseBase64Markdown = (base64String: string) => atob(base64String);

function decodeBase64Utf8(base64Str: string) {
  return decodeURIComponent(atob(base64Str)); // decode base64 to binary string
}

export const trimBucketPrefix = (key: string) => {
  const prefix = "markdown/";
  const suffix = ".mdx";
  return key.replace(prefix, "").replace(suffix, "");
};

export async function getPosts() {
  const res = await fetch(
    "https://yuga4madrxep2fy3kbpqkmkckq0bzitw.lambda-url.eu-west-1.on.aws/fetchpages"
  );
  const json = (await res.json()) as { key: string; base64: string }[];

  const posts = json
    .map((p) => ({
      key: trimBucketPrefix(p.key),
      content: decodeBase64Utf8(p.base64),
    }))
    .filter((p) => !!p.key)
    .map((p) => parseFrontmatter(p.content))
    .map(
      (p) =>
        ({
          frontmatter: p.data,
          html: marked.parse(p.content),
        } as CmsPost)
    );

  return posts;
}

export const getArticleUrl = (slug: string | undefined) =>
  slug ? `/posts/${slug}` : "/";
