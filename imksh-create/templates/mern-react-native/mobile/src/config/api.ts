import axios from "axios";
import { get } from "../utils/storage";

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