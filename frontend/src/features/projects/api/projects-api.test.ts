import { defaultFormValues } from '@/lib/defaults';

vi.mock('@/shared/api/http-client', () => ({
  httpRequest: vi.fn(),
  jsonRequest: vi.fn((method: string, body: unknown) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })),
}));

import { httpRequest, jsonRequest } from '@/shared/api/http-client';
import { deleteProject, getProjects, saveProject } from './projects-api';

const mockedHttpRequest = vi.mocked(httpRequest);
const mockedJsonRequest = vi.mocked(jsonRequest);

describe('projects-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProjects retorna data cuando httpRequest resuelve', async () => {
    mockedHttpRequest.mockResolvedValue([{ id: '1' }] as never);

    const result = await getProjects();

    expect(result).toEqual({ data: [{ id: '1' }], error: null });
    expect(mockedHttpRequest).toHaveBeenCalledWith({ url: '/api/projects' });
  });

  it('getProjects retorna mensaje de error cuando falla', async () => {
    mockedHttpRequest.mockRejectedValue(new Error('boom'));

    const result = await getProjects();

    expect(result).toEqual({ data: null, error: 'Error al cargar los proyectos.' });
  });

  it('saveProject retorna id en caso exitoso', async () => {
    mockedHttpRequest.mockResolvedValue({ id: 'p1' } as never);
    const { id: _id, ...payload } = defaultFormValues;

    const result = await saveProject('u1', payload);

    expect(result).toEqual({ id: 'p1', error: null });
    expect(mockedJsonRequest).toHaveBeenCalledWith('POST', payload);
    expect(mockedHttpRequest).toHaveBeenCalledWith({
      url: '/api/projects',
      init: expect.objectContaining({ method: 'POST' }),
    });
  });

  it('saveProject retorna error cuando falla', async () => {
    mockedHttpRequest.mockRejectedValue(new Error('boom'));
    const { id: _id, ...payload } = defaultFormValues;

    const result = await saveProject('u1', payload);

    expect(result).toEqual({ id: null, error: 'Error al guardar el proyecto.' });
  });

  it('deleteProject retorna null en error cuando request es exitosa', async () => {
    mockedHttpRequest.mockResolvedValue({ success: true } as never);

    const result = await deleteProject('p1');

    expect(result).toEqual({ error: null });
    expect(mockedHttpRequest).toHaveBeenCalledWith({
      url: '/api/projects/p1',
      init: { method: 'DELETE' },
    });
  });

  it('deleteProject retorna mensaje de error cuando falla', async () => {
    mockedHttpRequest.mockRejectedValue(new Error('boom'));

    const result = await deleteProject('p1');

    expect(result).toEqual({ error: 'Error al eliminar el proyecto.' });
  });
});
