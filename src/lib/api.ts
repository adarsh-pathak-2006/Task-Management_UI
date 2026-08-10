const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    let message = data.detail || data.non_field_errors?.[0];
    if (!message && typeof data === 'object') {
      const entries = Object.entries(data);
      if (entries.length > 0) {
        message = entries
          .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
          .join(' | ');
      }
    }
    super(message || 'An API error occurred');
    this.status = status;
    this.data = data;
  }
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Token ${token}`);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // No Content
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data;
}
