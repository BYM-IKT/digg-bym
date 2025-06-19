import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { diggCmsLoader } from "./lib/cms-api";

const mxdPosts = defineCollection({
  /* Retrieve all Markdown files in your pages directory. */
  loader: glob({ pattern: "**/*.mdx", base: "./src/pages" }),
  //schema: /* ... */
});

const cmsPosts = defineCollection({
  loader: diggCmsLoader(),
  //schema: /* ... */
});
export const collections = { mxdPosts, cmsPosts };
