import { LAMBDA_API_URL } from "./api";
import { Result } from "./result";

type LoginInputDto = {
  username: string;
  password: string;
};
export async function login({
  username,
  password,
}: LoginInputDto): Promise<Result<string, string>> {
  const res = await fetch(LAMBDA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return Result.succeed(data.token);

    // Navigate to protected route or update state
  } else {
    return Result.fail("Invalid credentials");
  }
}

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
