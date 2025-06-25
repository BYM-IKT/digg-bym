import { userManager } from "$lib/auth";
import type { User } from "oidc-client-ts";
import { writable } from "svelte/store";

export const user = writable<User | null>(null);

userManager.getUser().then((u) => {
  if (u && !u.expired) user.set(u);
});
