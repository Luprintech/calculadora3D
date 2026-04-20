vi.mock('@/shared/api/http-client', async () => {
  const actual = await vi.importActual<typeof import('@/shared/api/http-client')>('@/shared/api/http-client');
  return {
    ...actual,
    httpRequest: vi.fn(),
  };
});

import { HttpClientError, httpRequest } from '@/shared/api/http-client';
import { getAuthUser, logoutAuth } from './auth-api';

const mockedHttpRequest = vi.mocked(httpRequest);

describe('auth-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAuthUser retorna user cuando endpoint responde ok', async () => {
    mockedHttpRequest.mockResolvedValue({
      user: { id: 'u1', email: 'a@b.com', name: 'Ana', photo: null },
    } as never);

    const result = await getAuthUser();

    expect(result).toEqual({ id: 'u1', email: 'a@b.com', name: 'Ana', photo: null });
    expect(mockedHttpRequest).toHaveBeenCalledWith({ url: '/api/auth/user' });
  });

  it('getAuthUser retorna null en 401/403', async () => {
    mockedHttpRequest.mockRejectedValue(new HttpClientError('No autenticado', 401, '/api/auth/user', null));

    const result = await getAuthUser();

    expect(result).toBeNull();
  });

  it('getAuthUser re-lanza errores no auth', async () => {
    mockedHttpRequest.mockRejectedValue(new HttpClientError('Boom', 500, '/api/auth/user', null));

    await expect(getAuthUser()).rejects.toMatchObject({
      name: 'HttpClientError',
      status: 500,
    });
  });

  it('logoutAuth llama endpoint de logout con método GET', async () => {
    mockedHttpRequest.mockResolvedValue({ success: true } as never);

    await logoutAuth();

    expect(mockedHttpRequest).toHaveBeenCalledWith({
      url: '/api/auth/logout',
      init: { method: 'GET' },
    });
  });
});
