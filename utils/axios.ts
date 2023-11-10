import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { baseUrl } from "../Helpers/baseUrl";
import Cookies from "js-cookie";

interface ApiCall {
  method?: string;
  route: string;
  body?: any;
  secured?: boolean;

  [key: string]: any;
}

export const client = axios.create({
  baseURL: `${baseUrl}/api/v2`,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.log("Request failed", error);
    return Promise.reject(error);
  }
);

export const apiCall = function ({
  method = "GET",
  route,
  body = {},
  secured = true,
  ...args
}: ApiCall) {
  return client({
    method,
    url: route,
    data: body,
    ...args,
  });
};
