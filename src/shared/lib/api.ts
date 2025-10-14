async function baseApi<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body != null;
  const headers = new Headers(init.headers || {});

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
    } catch (e) {
      // ignore json parse error
    }

    if (res.status === 401) {
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }

    throw new Error(err.message || `HTTP ${res.status}`);
  }

  try {
    return await res.json();
  } catch (e) {
    return undefined as T;
  }
}

function addQueryParams(url: string, params?: Record<string, any>): string {
  if (!params) return url;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) searchParams.append(key, String(value));
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

export const api = {
  async get<T>(url: string, init: RequestInit & { params?: Record<string, any> } = {}): Promise<T> {
    const urlWithParams = addQueryParams(url, init.params);
    const { params, ...restInit } = init;
    return baseApi<T>(urlWithParams, { ...restInit, method: 'GET' });
  },

  async post<T>(url: string, data?: any, init: RequestInit = {}): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return baseApi<T>(url, { ...init, method: 'POST', body });
  },

  async put<T>(url: string, data?: any, init: RequestInit = {}): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return baseApi<T>(url, { ...init, method: 'PUT', body });
  },

  async delete<T>(url: string, init: RequestInit = {}): Promise<T> {
    return baseApi<T>(url, { ...init, method: 'DELETE' });
  },
};
