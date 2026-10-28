
export const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
console.log("CURRENT API URL:", API);
export const tokens = {
  get access() { return localStorage.getItem("at"); },
  get refresh() { return localStorage.getItem("rt"); },
  set(a, r) {
    localStorage.setItem("at", a);
    localStorage.setItem("rt", r);
  },
  clear() {
    localStorage.removeItem("at");
    localStorage.removeItem("rt");
  },
};

export const imgUrl = (p) =>
  p && typeof p === "string"
    ? (p.startsWith("http") ? p : `${API}/${p.replace(/^\//, "")}`)
    : "";

export async function request(path, { method = "GET", body, auth = false, retry = true } = {}) {
  const headers = {};

  if (auth && tokens.access) {
    headers.Authorization = `Bearer ${tokens.access}`;
  }

  let payload = body;

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(API + path, {
    method,
    headers,
    body: payload,
  });

  const json = await res.json().catch(() => ({}));

  // Access token expired -> try refresh token once
  if (res.status === 401 && auth && retry && tokens.refresh) {
    const r = await fetch(API + "/user/rotate-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.refresh}`,
      },
    });

    if (r.ok) {
      const d = (await r.json()).data;
      tokens.set(d.access_token, d.refresh_token);
      return request(path, { method, body, auth, retry: false });
    }

    tokens.clear();
    window.dispatchEvent(new Event("auth:logout"));
  }

  if (!res.ok || json.status === 429) {
    const issues = (json.cause?.issues || [])
      .map((i) => (i.path?.length ? `${i.path.join(".")}: ` : "") + i.message)
      .join(" • ");

    throw new Error(
      json.status === 429
        ? json.message || "Too many requests"
        : issues || json.error_message || "Something went wrong"
    );
  }

  return json.data;
}
