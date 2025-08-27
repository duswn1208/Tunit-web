export async function api<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body != null;
  const headers = new Headers(init.headers || {});

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
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
      window.location.href = '/auth/login';
    }

    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : await res.json();
}
