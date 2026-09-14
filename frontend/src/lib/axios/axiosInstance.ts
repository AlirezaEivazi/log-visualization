import axios from 'axios';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Single shared axios instance for the whole app. Every API service module
 * imports this instead of calling axios directly, so base URL, headers,
 * timeouts, and interceptors only need to be configured once.
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
