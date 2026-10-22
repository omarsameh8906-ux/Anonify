import { request } from "./client";

export const authApi = {
  signup: (body) => request("/auth/signup", { method: "POST", body }),
  confirmEmail: (body) => request("/auth/confirm-email", { method: "PATCH", body }),
  resendConfirm: (email) => request("/auth/resend-confirm-email", { method: "PATCH", body: { email } }),
  login: (body) => request("/auth/login", { method: "POST", body }),
};

export const userApi = {
  me: () => request("/user", { auth: true }),
  update: (body) => request("/user", { method: "PATCH", auth: true, body }),
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("attachment", file);
    return request("/user/profile-image", { method: "POST", auth: true, body: fd });
  },
  logout: () => request("/user/logout", { method: "POST", auth: true, body: { action: 0 } }),
};

export const messageApi = {
  list: ({ type = "0", page = 1, limit = 5 }) => request(`/message?type=${type}&page=${page}&limit=${limit}`, { auth: true }),
  remove: (id) => request(`/message/${id}`, { method: "DELETE", auth: true }),
  send: ({ receiverId, content, files = [] }, auth) => {
    const fd = new FormData();
    fd.append("receiverId", receiverId);
    fd.append("content", content);
    files.forEach((f) => fd.append("attachments", f));
    return request("/message", { method: "POST", body: fd, auth });
  },
};
