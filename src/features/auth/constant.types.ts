import api from "@/lib/axios";
export const END_POINTS = {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
}
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post(END_POINTS.REGISTER, data),

  login: (data: { email: string; password: string }) =>
    api.post(END_POINTS.LOGIN, data),

  logout: () =>
    api.post(END_POINTS.LOGOUT),

  me: () =>
    api.get(END_POINTS.ME),
};