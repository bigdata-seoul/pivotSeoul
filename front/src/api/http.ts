const DEFAULT_API_BASE = 'http://localhost:8080';

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? DEFAULT_API_BASE).replace(/\/$/, '');
export const SPRING_API_BASE = `${API_BASE}/api`;

export async function fetchJson<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${SPRING_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`HTTP ${response.status} ${path}: ${message}`);
  }

  return response.json() as Promise<TResponse>;
}

export function postJson<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  return fetchJson<TResponse>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
