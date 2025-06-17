export function slugify(text: string) {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .trim() // Trim whitespace
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Collapse multiple -
}

export function formatDateToLocalISO(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const isDarMode = (w: Window & typeof globalThis) =>
  w.matchMedia("(prefers-color-scheme: dark)").matches;

export const buildPath = (...str: string[]) => str.join("/");

export function utf8ToBase64(str: string) {
  const uriEncoded = encodeURIComponent(str);
  return btoa(uriEncoded);
}

export function downloadFile(file: File) {
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();

  URL.revokeObjectURL(url); // Clean up
}

export function decodeBase64Utf8(base64Str: string) {
  return decodeURIComponent(atob(base64Str));
}

export const trimBucketPrefix = (key: string) => {
  const prefix = "markdown/";
  const suffix = ".mdx";
  return key.replace(prefix, "").replace(suffix, "");
};

export const convertFileToBase64 = (file: File): Promise<string> => {
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

export function getBucketKey(type: "md" | "image") {
  switch (type) {
    case "md":
      return "markdown";
    case "image":
      return "images";
  }
}
