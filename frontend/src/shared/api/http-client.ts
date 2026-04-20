export class HttpClientError extends Error {
  status: number;
  url: string;
  body: unknown;

  constructor(message: string, status: number, url: string, body: unknown) {
    super(message);
    this.name = 'HttpClientError';
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

interface RequestOptions {
  url: string;
  init?: RequestInit;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function httpRequest<T>({ url, init }: RequestOptions): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    ...init,
  });

  const body = await parseJsonSafe(response);

  if (!response.ok) {
    const maybeError = body as { error?: string } | null;
    const message = maybeError?.error ?? `HTTP ${response.status}`;
    throw new HttpClientError(message, response.status, url, body);
  }

  return body as T;
}

export function jsonRequest(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
