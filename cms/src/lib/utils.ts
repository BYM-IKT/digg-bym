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
  return btoa(unescape(encodeURIComponent(str)));
}
