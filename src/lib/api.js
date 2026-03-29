const TOKEN_KEY = "bso-auth-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    let message = "Request failed";
    try {
      const payload = await response.json();
      message = payload.message || message;
    } catch {
      // ignore json parse failure
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (path, opts = {}) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts = {}) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts = {}) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts = {}) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts = {}) => request(path, { ...opts, method: "DELETE" }),
};
