import { v4 as uuidv4 } from "uuid";
import { decodeBase64Utf8, trimBucketPrefix } from "./fileutils";
import type { PostDto } from "./types";
import { utf8ToBase64 } from "./utils";
import { toast } from "@zerodevx/svelte-toast";

export const CMS_CDN_URL = "https://dclaw1ks4v8ju.cloudfront.net/images";

export async function uploadMarkdown(key: string, file: string) {
  const res = await fetch(
    "https://yuga4madrxep2fy3kbpqkmkckq0bzitw.lambda-url.eu-west-1.on.aws/uploadcontent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: key,
        content: utf8ToBase64(file),
      }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to upload markdown");
  }
  toast.push("Innlegg lagret!", {});
}

export async function fetchPosts() {
  const res = await fetch(
    "https://yuga4madrxep2fy3kbpqkmkckq0bzitw.lambda-url.eu-west-1.on.aws/fetchpages"
  );
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
/* 
export async function fetchimage(key: string) {
  const res = await fetch(
    "https://yuga4madrxep2fy3kbpqkmkckq0bzitw.lambda-url.eu-west-1.on.aws/fetchimage?key=" +
      key,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to upload image");
  }
  const { base64, contentType } = (await res.json()) as {
    base64: string;
    contentType: string;
  };

  const base64plus = `data:${contentType};base64,${base64}`;
  //const blob = base64ToBlob(base64, contentType);
  //const url = URL.createObjectURL(blob);

  return base64plus;
} */

export async function uploadImage(file: File) {
  const base64 = (await convertFileToBase64(file)).split(",")[1];

  const filename = uuidv4().concat(file.name);
  const res = await fetch(
    "https://yuga4madrxep2fy3kbpqkmkckq0bzitw.lambda-url.eu-west-1.on.aws/uploadimage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: filename,
        content: base64,
      }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to upload image");
  }
  return filename;
}

export function getBucketKey(type: "md" | "image") {
  switch (type) {
    case "md":
      return "markdown";
    case "image":
      return "images";
  }
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(new Blob([file], { type: file.type }));
    reader.onload = () =>
      resolve(
        reader.result?.toString() ||
          //.replace(/^data:(.*,)?/, "")
          ""
      );
    reader.onerror = (error) => reject(error);
  });
};

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
