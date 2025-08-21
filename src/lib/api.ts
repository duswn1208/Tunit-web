export async function api<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const res = await fetch(input, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let err: any = {};
    try {
      err = await res.json();
    } catch {}
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : await res.json();
}
