// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://esse-aqui-midia.vercel.app/api';

console.log('🔌 API Configuration Loaded');
console.log('API_URL:', API_URL);

export const API_BASE_URL = API_URL;

export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  // Users
  USERS: {
    GET_ALL: '/users',
    GET_ONE: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  // Clients
  CLIENTS: {
    GET_ALL: '/clients',
    GET_ONE: (id: string) => `/clients/${id}`,
    CREATE: '/clients',
    UPDATE: (id: string) => `/clients/${id}`,
    DELETE: (id: string) => `/clients/${id}`,
  },
  // Invoices
  INVOICES: {
    GET_ALL: '/invoices',
    GET_ONE: (id: string) => `/invoices/${id}`,
    CREATE: '/invoices',
    UPDATE: (id: string) => `/invoices/${id}`,
    DELETE: (id: string) => `/invoices/${id}`,
  },
  // Payments
  PAYMENTS: {
    GET_ALL: '/payments',
    GET_ONE: (id: string) => `/payments/${id}`,
    CREATE: '/payments',
    UPDATE: (id: string) => `/payments/${id}`,
    DELETE: (id: string) => `/payments/${id}`,
  },
  // Appointments
  APPOINTMENTS: {
    GET_ALL: '/appointments',
    GET_ONE: (id: string) => `/appointments/${id}`,
    CREATE: '/appointments',
    UPDATE: (id: string) => `/appointments/${id}`,
    DELETE: (id: string) => `/appointments/${id}`,
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fetch helper with error handling
export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const url = buildApiUrl(endpoint);

  // Create headers object with proper typing
  const headers: Record<string, string> = {
    ...API_CONFIG.HEADERS,
  };

  // Merge custom headers from options
  if (options?.headers && typeof options.headers === 'object') {
    const customHeaders = options.headers as Record<string, string>;
    Object.assign(headers, customHeaders);
  }

  // Add auth token if available
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};
