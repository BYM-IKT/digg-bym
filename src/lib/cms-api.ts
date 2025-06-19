import type { Loader, LoaderContext } from "astro/loaders";
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
  id: string;
  frontmatter: CmsMetadata;
  html: string;
};
export const parseBase64Markdown = (base64String: string) => atob(base64String);

const API_BASE_URL =
  "https://yuga4madrxep2fy3kbpqkmkckq0bzitw.lambda-url.eu-west-1.on.aws";

function decodeBase64Utf8(base64Str: string) {
  return decodeURIComponent(atob(base64Str)); // decode base64 to binary string
}

export const trimBucketPrefix = (key: string) => {
  const prefix = "markdown/";
  const suffix = ".mdx";
  return key.replace(prefix, "").replace(suffix, "");
};

export function diggCmsLoader(): Loader {
  return {
    name: "digg-cms-loader",
    load: async (context: LoaderContext): Promise<void> => {
      const posts = await getCmsPosts();

      context.store.clear();
      for (const post of posts) {
        context.store.set({
          id: post.id,
          data: post.frontmatter.data,
          rendered: await context.renderMarkdown(post.frontmatter.content),
        });
      }
    },
  };
}

async function getCmsPosts() {
  const res = await fetch(API_BASE_URL.concat("/fetchpages"));
  const json = (await res.json()) as { key: string; base64: string }[];

  const posts = await Promise.all(
    json
      .map((p) => ({
        key: trimBucketPrefix(p.key),
        content: decodeBase64Utf8(p.base64),
      }))
      .filter((p) => !!p.key)
      .map(async (p) => ({
        id: p.key,
        frontmatter: parseFrontmatter<CmsMetadata>(p.content),
      }))
  );
  return posts;
}

export async function getCmsPost(id: string) {
  const res = await fetch(API_BASE_URL.concat(`/fetchcontent?key=${id}`));
  const json = (await res.json()) as { key: string; base64: string };

  return {
    key: trimBucketPrefix(json.key),
    content: parseFrontmatter<CmsMetadata>(decodeBase64Utf8(json.base64)),
  };
}

export const getArticleUrl = (slug: string | undefined) =>
  slug ? `/posts/${slug}` : "/";
