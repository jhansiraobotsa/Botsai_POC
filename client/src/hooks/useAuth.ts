
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

const API_BASE = "http://192.168.1.31:8001/api/v1";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  plan: string;
  created_at: string;
  oauth_provider?: string;
  oauth_sub?: string;
}

export interface LoginCredentials {
  username: string; // FastAPI OAuth2PasswordRequestForm expects 'username'
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone_number: string;
  plan: string;
}

async function apiRequest(method: string, endpoint: string, data?: any) {
  const token = localStorage.getItem('access_token');
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  };

  if (data) {
    if (method === 'POST' && endpoint.includes('/login')) {
      // For login, use form data format
      config.body = new URLSearchParams(data);
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
    } else {
      config.body = JSON.stringify(data);
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response;
}

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<AuthUser | undefined>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return undefined;
      
      try {
        const response = await apiRequest('GET', '/auth/me');
        return await response.json();
      } catch (error) {
        localStorage.removeItem('access_token');
        return undefined;
      }
    },
    retry: false,
    staleTime: 30 * 1000, // 30 seconds cache
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest('POST', '/auth/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await apiRequest('POST', '/auth/register', userData);
      return response.json();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await apiRequest('POST', '/auth/logout');
        } catch (error) {
          console.warn('Logout API call failed:', error);
        }
      }
      localStorage.removeItem('access_token');
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation('/login');
    },
  });

  const login = async (username: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ username, password });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      await registerMutation.mutateAsync(userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!localStorage.getItem('access_token'),
    login,
    register,
    logout,
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}
