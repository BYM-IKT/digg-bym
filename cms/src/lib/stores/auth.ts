import { writable } from "svelte/store";

export const user = writable(null);

export function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    user.set(decoded);
    return true;
  } catch {
    return false;
  }
}
