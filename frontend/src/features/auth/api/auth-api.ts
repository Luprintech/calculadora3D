import { HttpClientError, httpRequest } from '@/shared/api/http-client';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  photo: string | null;
}

interface AuthUserResponse {
  user: AuthUser | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const data = await httpRequest<AuthUserResponse>({ url: '/api/auth/user' });
    return data?.user ?? null;
  } catch (error) {
    if (error instanceof HttpClientError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

export async function logoutAuth(): Promise<void> {
  await httpRequest<unknown>({
    url: '/api/auth/logout',
    init: { method: 'GET' },
  });
}
