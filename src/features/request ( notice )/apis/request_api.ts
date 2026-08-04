import api from "@/lib/axios";
import { getAllRequestResponse, sentRequestBody, sentRequestResponse } from "../request.types";

export const requestApi = {
  sent: (data: sentRequestBody) => api.post<sentRequestResponse>("/request/sent", data),
  getAll: () => api.get<getAllRequestResponse>("/request/"),
  accept: (data: sentRequestBody) => api.post<getAllRequestResponse>(`/request/accept-request`, data),
  decline: (data: sentRequestBody) => api.post<getAllRequestResponse>(`/request/decline-request`, data),
};