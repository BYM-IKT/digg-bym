import { UserManager } from "oidc-client-ts";

const oidcConfig = {
  authority: "https://sandbox-oslo.onelogin.com/oidc/2", // OneLogin issuer
  client_id: "4a1e0220-33ec-013e-3f9e-5f10d2e0632e38599",
  redirect_uri: import.meta.env.VITE_ONELOGIN_REDIRECT_URI, // adjust for prod
  post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
};

export const userManager = new UserManager(oidcConfig);

export function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`,
    },
  });
}
