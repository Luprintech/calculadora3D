import { httpRequest, jsonRequest } from './http-client';

describe('http-client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('envía credentials include por defecto y retorna JSON parseado', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const data = await httpRequest<{ ok: boolean }>({ url: '/api/test' });

    expect(data).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith('/api/test', { credentials: 'include' });
  });

  it('lanza HttpClientError con mensaje de body.error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 }),
    );

    await expect(httpRequest({ url: '/api/private' })).rejects.toMatchObject({
      name: 'HttpClientError',
      status: 401,
      message: 'No autenticado',
      url: '/api/private',
    });
  });

  it('si el body no es JSON usa mensaje HTTP <status>', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Service unavailable', { status: 503 }),
    );

    await expect(httpRequest({ url: '/api/down' })).rejects.toMatchObject({
      name: 'HttpClientError',
      status: 503,
      message: 'HTTP 503',
      body: null,
    });
  });

  it('retorna null cuando la respuesta es vacía y ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 200 }));

    const data = await httpRequest<null>({ url: '/api/empty' });
    expect(data).toBeNull();
  });

  it('jsonRequest arma RequestInit para payload JSON', () => {
    const req = jsonRequest('POST', { a: 1 });

    expect(req).toEqual({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a: 1 }),
    });
  });
});
