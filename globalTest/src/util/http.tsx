import axios, { type AxiosResponse, AxiosError } from 'axios';
import qs from 'qs';

let globalRedirectHandler: null | ((status: number) => void) = null;

export const setGlobalRedirectHandler = (fn: (status: number) => void) => {
  globalRedirectHandler = fn;
};

import { handle401WithTokenRefresh, shouldRefreshToken, parseError } from './helpers';

// Add this import for success message handling
import { getCustomMessage } from './whitelist';

const SERVER_URL = "http://localhost:3000/error/";

const instance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Cache-Control': 'no-cache, no-store',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Build query string from params
const buildQuery = (params: any) => {
  const query = qs.stringify(params, { allowDots: true });
  return query ? `?${query}` : '';
};

// 🔥 Add subscriber system
let subscriber: any = null;

const subscribe = (newSub: any) => {
  subscriber = newSub;
};

const unsubscribe = () => {
  subscriber = null;
};

const notify = (err: any, status: any = undefined) => {
  console.log('🔥 notify called with:', err, 'status:', status);
  console.log('🔥 subscriber exists:', !!subscriber);
  
  if (subscriber) {
    console.log('🔥 Calling subscriber.handle with:', err);
    subscriber.handle(err); // 🔥 This calls AlertsManager.addAlert()
  } else {
    console.log('🔥 No subscriber found! Call commsHubApi.subscribe() first');
  }
  
  if (status >= 500 && subscriber) {
    console.log('🔥 Calling subscriber.on500Error');
    subscriber.on500Error(); // 🔥 This shows error page
  }
};

// 🔥 NEW: Success handler from original solution
const handleSuccessCase = (response: AxiosResponse) => {
  console.log('🔥 handleSuccessCase called');
  console.log('🔥 response.config.url:', response.config.url);
  console.log('🔥 response.config.baseURL:', response.config.baseURL);
  
  // Construct the full URL path for matching
  const baseURL = response.config.baseURL || '';
  const url = response.config.url || '';
  
  // Extract the path part from baseURL + url
  const fullURL = baseURL + url; // "http://localhost:3000/error/200"
  const urlPath = fullURL.replace(/^https?:\/\/[^\/]+/, ''); // "/error/200"
  
  console.log('🔥 Full URL:', fullURL);
  console.log('🔥 URL Path for matching:', urlPath);
  
  const successMessage = getCustomMessage(urlPath);
  console.log('🔥 successMessage result:', successMessage);

  if (successMessage.length > 0) {
    console.log('🔥 Notifying with success message:', successMessage);
    notify({ 'success': successMessage });
  } else {
    console.log('🔥 No success message found for URL path:', urlPath);
  }

  return response.data;
};

// Enhanced error handler that combines token refresh + global redirects
const handleErrorCase = async (error: AxiosError) => {
  const status = error?.response?.status;
  console.log('🔥 Handling error with status:', status);
  
  if (shouldRefreshToken(error)) {
    console.log('🔥 Attempting token refresh for 401 error...');
    
    try {
      return await handle401WithTokenRefresh(error);
    } catch (refreshError) {
      console.log('🔥 Token refresh failed, proceeding to global redirect');
      
      // If token refresh fails, this will redirect to /401 page
      if (globalRedirectHandler && status) {
        globalRedirectHandler(status);
      }
      return Promise.reject(refreshError);
    }
  }
  
  // STEP 2: Handle other errors with global redirect
  console.log('🔥 Non-401 error or refresh not needed, using global handler');
  
  if (globalRedirectHandler && status) {
    globalRedirectHandler(status);
  }
  
  const parsedError = parseError(error);
  
  if (parsedError) {
    notify({ 'error': parsedError.message }, parsedError.status); // 🔥 This triggers AlertsManager
  }
  
  console.log('🔥 Parsed error:', parsedError);
  return Promise.reject(error);
};

instance.interceptors.request.use(config => config);

// 🔥 UPDATED: Now uses handleSuccessCase for success responses
instance.interceptors.response.use(
  handleSuccessCase, // 🔥 Changed from: (response: AxiosResponse) => response.data
  async (error: AxiosError) => {
    return await handleErrorCase(error);
  }
);

// 🔥 Updated export to include subscribe/unsubscribe
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

  subscribe,
  unsubscribe
};