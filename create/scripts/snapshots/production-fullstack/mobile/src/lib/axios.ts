import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { get } from "./storage";
import { ApiResponse } from "../types/common.type";

declare module 'axios' {
  export interface AxiosInstance {
    get<T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patch<T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  }
}

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = await get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});