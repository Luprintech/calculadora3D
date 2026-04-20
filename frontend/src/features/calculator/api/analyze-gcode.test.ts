vi.mock('@/shared/api/http-client', () => ({
  httpRequest: vi.fn(),
}));

import { httpRequest } from '@/shared/api/http-client';
import { analyzeGcodeFile } from './analyze-gcode';

const mockedHttpRequest = vi.mocked(httpRequest);

describe('analyze-gcode api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('envía archivo como FormData a /api/analyze-gcode', async () => {
    mockedHttpRequest.mockResolvedValue({
      data: { printingTimeSeconds: 120, filamentWeightGrams: 1.25 },
    } as never);

    const file = new File(['G1 X0'], 'pieza.gcode', { type: 'text/plain' });
    await analyzeGcodeFile(file);

    expect(mockedHttpRequest).toHaveBeenCalledTimes(1);
    const call = mockedHttpRequest.mock.calls[0][0] as { url: string; init?: RequestInit };

    expect(call.url).toBe('/api/analyze-gcode');
    expect(call.init?.method).toBe('POST');
    expect(call.init?.body).toBeInstanceOf(FormData);

    const sent = call.init?.body as FormData;
    expect(sent.get('gcodeFile')).toBe(file);
  });
});
