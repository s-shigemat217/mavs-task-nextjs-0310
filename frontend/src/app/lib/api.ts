const DEFAULT_API_BASE_URL = "http://localhost:3001";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

const parseJsonResponse = async <T>(response: Response): Promise<T | null> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
};

export const requestJson = async <T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T | null }> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, init);
    return {
      ok: response.ok,
      status: response.status,
      data: await parseJsonResponse<T>(response),
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
};
