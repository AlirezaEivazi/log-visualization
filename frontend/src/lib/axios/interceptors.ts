import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { axiosInstance } from './axiosInstance';
import { useUiStore } from '@/store/uiStore';
import type { ApiError } from '@/types/api.types';

const AUTH_TOKEN_KEY = 'access_token';

// Zustand stores can be read outside of React (no hook needed) via
// `.getState()` — handy here since an axios interceptor isn't a component.
const ERROR_MESSAGES = {
  en: {
    unexpected: 'Something went wrong.',
    noResponse: 'No response from the server. Check your network connection or the API base URL.',
  },
  fa: {
    unexpected: 'خطای غیرمنتظره‌ای رخ داد.',
    noResponse: 'پاسخی از سرور دریافت نشد. اتصال شبکه یا آدرس API را بررسی کنید.',
  },
};

/**
 * Attaches the bearer token (if any) to every outgoing request.
 * Swap this for your real auth strategy (cookies, a token store, etc.) —
 * this is intentionally the simplest thing that works.
 */
function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return config;
}

/** Turns any axios error into a small, predictable shape the UI can rely on. */
function normalizeError(error: AxiosError): ApiError {
  const messages = ERROR_MESSAGES[useUiStore.getState().locale];

  if (error.response) {
    const data = error.response.data as { message?: string } | undefined;
    return {
      status: error.response.status,
      message: data?.message || error.message || messages.unexpected,
      details: error.response.data,
    };
  }
  if (error.request) {
    return {
      status: 0,
      message: messages.noResponse,
    };
  }
  return { status: -1, message: error.message };
}

function responseErrorInterceptor(error: AxiosError) {
  const normalized = normalizeError(error);

  if (normalized.status === 401 && typeof window !== 'undefined') {
    // Central place to react to an expired/invalid session, e.g.:
    // window.localStorage.removeItem(AUTH_TOKEN_KEY);
    // window.location.assign('/login');
  }

  return Promise.reject(normalized);
}

axiosInstance.interceptors.request.use(requestInterceptor);
axiosInstance.interceptors.response.use((response) => response, responseErrorInterceptor);
