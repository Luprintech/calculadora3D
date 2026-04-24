import { HttpClientError, httpRequest } from '@/shared/api/http-client';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  photo: string | null;
}

export interface GuestSession {
  id: string;
  expiresAt?: number;
}

interface AuthUserResponse {
  user: AuthUser | null;
  guest?: GuestSession | null;
}

export async function getAuthState(): Promise<{ user: AuthUser | null; guest: GuestSession | null }> {
  try {
    const data = await httpRequest<AuthUserResponse>({ url: '/api/auth/user' });
    return { user: data?.user ?? null, guest: data?.guest ?? null };
  } catch (error) {
    if (error instanceof HttpClientError && (error.status === 401 || error.status === 403)) {
      return { user: null, guest: null };
    }
    throw error;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const state = await getAuthState();
  return state.user;
}

export async function startGuestSession(): Promise<GuestSession> {
  const data = await httpRequest<{ guest: GuestSession }>({
    url: '/api/auth/guest/start',
    init: { method: 'POST' },
  });
  return data.guest;
}

export async function logoutGuestSession(): Promise<void> {
  await httpRequest<unknown>({ url: '/api/auth/guest/logout', init: { method: 'POST' } });
}

export async function logoutAuth(): Promise<void> {
  await httpRequest<unknown>({
    url: '/api/auth/logout',
    init: { method: 'GET' },
  });
}
