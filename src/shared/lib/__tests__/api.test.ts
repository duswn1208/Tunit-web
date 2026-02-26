import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function jsonResponse(data: any, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

function errorResponse(status: number, body: any = {}) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('api.get', () => {
  it('GET 메서드로 요청하고 JSON을 반환한다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ id: 1 }));

    const result = await api.get('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toEqual({ id: 1 });
  });

  it('params가 있으면 쿼리스트링을 추가한다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse([]));

    await api.get('/api/test', { params: { page: 1, size: 10 } });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test?page=1&size=10',
      expect.anything(),
    );
  });

  it('params에서 null/undefined 값은 제외한다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse([]));

    await api.get('/api/test', { params: { a: 1, b: null, c: undefined } });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test?a=1',
      expect.anything(),
    );
  });

  it('params가 빈 객체이면 쿼리스트링 없이 요청한다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse([]));

    await api.get('/api/test', { params: {} });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.anything());
  });
});

describe('api.post', () => {
  it('POST 메서드로 body를 JSON 직렬화하여 요청한다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ ok: true }));

    await api.post('/api/test', { name: 'hello' });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'hello' }),
      }),
    );
  });

  it('data가 없으면 body를 보내지 않는다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ ok: true }));

    await api.post('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        body: undefined,
      }),
    );
  });
});

describe('api.put', () => {
  it('PUT 메서드로 요청한다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ ok: true }));

    await api.put('/api/test', { id: 1 });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ id: 1 }),
      }),
    );
  });
});

describe('api.delete', () => {
  it('DELETE 메서드로 요청한다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ ok: true }));

    await api.delete('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});

describe('credentials', () => {
  it('모든 요청에 credentials: include가 포함된다', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({}));

    await api.get('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ credentials: 'include' }),
    );
  });
});

describe('에러 처리', () => {
  it('HTTP 에러 응답 시 Error를 throw한다', async () => {
    mockFetch.mockReturnValueOnce(errorResponse(400, { message: 'Bad Request' }));

    await expect(api.get('/api/test')).rejects.toThrow('Bad Request');
  });

  it('에러 응답에 message가 없으면 HTTP 상태코드를 포함한다', async () => {
    mockFetch.mockReturnValueOnce(errorResponse(500, {}));

    await expect(api.get('/api/test')).rejects.toThrow('HTTP 500');
  });

  it('JSON 파싱 실패 시 undefined를 반환한다', async () => {
    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 204,
        json: () => Promise.reject(new Error('no body')),
      }),
    );

    const result = await api.delete('/api/test');
    expect(result).toBeUndefined();
  });
});
