const FINAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  async login(email: string, password: string) {
    const url = `${FINAL_API_URL}/auth/login`;
    console.log('🔑 Login POST to:', url);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      return data;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  async register(email: string, password: string, name: string) {
    const url = `${FINAL_API_URL}/auth/register`;
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name })
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      return data;
    } catch (error: any) {
      console.error('❌ Register error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  getToken() {
    return localStorage.getItem('access_token');
  }
};
