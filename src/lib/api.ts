export async function api<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body != null;
  const headers = new Headers(init.headers || {});

  // FormData일 경우 Content-Type을 명시하지 않음 (fetch가 boundary 포함 자동 처리)
  if (hasBody && !headers.has('Content-Type')) {
    if (!(init.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const res = await fetch(input, {
    headers,
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    let err: any = {};
    try {
      err = await res.json();
    } catch {}

    if (res.status === 401) {
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
      // /auth/login 경로에서는 아무 동작도 하지 않음
    }

    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  const contentType = res.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  } else {
    return (await res.text()) as unknown as T;
  }
}
