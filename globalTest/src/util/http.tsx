import axios, {type AxiosResponse, AxiosError } from 'axios';
import qs from 'qs';

let globalRedirectHandler: null | ((status: number) => void) = null;

export const setGlobalRedirectHandler = (fn: (status: number) => void) => {
  globalRedirectHandler = fn;
};

const SERVER_URL = "http://localhost:3000/error/";

const instance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Cache-Control': 'no-cache, no-store',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Handle request
instance.interceptors.request.use(config => config);

// Handle response + redirect
instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    const status = error?.response?.status;
    if (globalRedirectHandler && status) {
      globalRedirectHandler(status);
    }
    return Promise.reject(error);
  }
);

// Build query string from params
const buildQuery = (params: any) => {
  const query = qs.stringify(params, { allowDots: true });
  return query ? `?${query}` : '';
};

export const commsHubApi = {
  get: <T = any>(url: string, params?: any): Promise<T> =>
    instance.get(`${url}${buildQuery(params)}`),

  post: <T = any>(url: string, data?: any): Promise<T> =>
    instance.post(url, data),

  put: <T = any>(url: string, data?: any): Promise<T> =>
    instance.put(url, data),

  patch: <T = any>(url: string, data?: any): Promise<T> =>
    instance.patch(url, data),

  delete: <T = any>(url: string): Promise<T> =>
    instance.delete(url),
};
