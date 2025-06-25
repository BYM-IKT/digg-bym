import { toast } from "@zerodevx/svelte-toast";
import { v4 as uuidv4 } from "uuid";
import type { PostDto } from "./types";
import {
  convertFileToBase64,
  decodeBase64Utf8,
  trimBucketPrefix,
  utf8ToBase64,
} from "./utils";
import { fetchWithAuth } from "./auth";

export const CMS_CDN_URL = "https://dclaw1ks4v8ju.cloudfront.net/images";
export const LAMBDA_API_URL =
  "https://yuga4madrxep2fy3kbpqkmkckq0bzitw.lambda-url.eu-west-1.on.aws";

export async function uploadMarkdown(key: string, file: string) {
  const fullKey = key.concat(".mdx");
  const res = await fetchWithAuth(`${LAMBDA_API_URL}/uploadcontent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: fullKey,
      content: utf8ToBase64(file),
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to upload markdown");
  }
  toast.push("Innlegg lagret!", {});
}

/**
 * Henter alle keys og mdx.filer i base64
 * @returns
 */
export async function fetchPosts() {
  const res = await fetchWithAuth(`${LAMBDA_API_URL}/fetchpages`);
  const json = (await res.json()) as PostDto[];

  const posts = json
    .map(
      (p) =>
        ({
          key: trimBucketPrefix(p.key),
          base64: decodeBase64Utf8(p.base64),
        } as PostDto)
    )
    .filter((p) => !!p.key);

  return posts;
}

/**
 * Henter kun keys/navn på posts
 */
export async function fetchKeys() {
  const res = await fetchWithAuth(`${LAMBDA_API_URL}/fetchkeys`);
  const json = (await res.json()) as { key: string }[];

  const postsNames = json
    .map((i) => i.key.replace("markdown/", "").replace(".mdx", ""))
    .filter((i) => i.length > 0);

  return postsNames;
}

/**
 * @todo Implement this method
 */ export async function deleteFile() {
  return await fetchWithAuth(`${LAMBDA_API_URL}/deletecontent`, {
    method: "POST",
  });
}

export async function publishWorkflow() {
  return await fetchWithAuth(`${LAMBDA_API_URL}/triggerworkflow`, {
    method: "POST",
  });
}

export async function fetchFile(key: string, type: "md" | "img") {
  const res = await fetchWithAuth(`${LAMBDA_API_URL}/fetchcontent?key=` + key, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to upload image");
  }
  const { base64, contentType } = (await res.json()) as {
    base64: string;
    contentType: string;
  };
  if (type === "md") {
    return { key: trimBucketPrefix(key), base64: decodeBase64Utf8(base64) };
  }

  const base64plus = `data:${contentType};base64,${base64}`;
  //const blob = base64ToBlob(base64, contentType);
  //const url = URL.createObjectURL(blob);

  return { key: trimBucketPrefix(key), base64: base64plus };
}

export async function uploadImage(file: File) {
  const base64 = (await convertFileToBase64(file)).split(",")[1];

  const filename = uuidv4().concat(file.name);
  const res = await fetchWithAuth(`${LAMBDA_API_URL}/uploadimage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: filename,
      content: base64,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to upload image");
  }
  return filename;
}

function base64ToBlob(base64: string, mime = "image/jpeg") {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length)
    //.fill()
    .map((_, i) => byteChars.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

function extractBase64Metadata(base64String: string) {
  const regex = /^data:(.+);base64,(.*)$/;
  const matches = base64String.match(regex);

  if (!matches) {
    throw new Error("Invalid base64 data URL");
  }

  return {
    mimeType: matches[1], // e.g., image/png
    encoding: "base64",
    data: matches[2], // actual base64 data
  };
}
