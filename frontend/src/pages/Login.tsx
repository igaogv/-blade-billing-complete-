import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 Login page loaded');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('📋 Attempting login with:', email);

    try {
      const data = await authService.login(email, password);
      console.log('✅ Login API response:', data);
      
      // Safety check - token MUST be present
      if (!data || !data.access_token) {
        console.error('❌ CRITICAL: API returned no token!');
        console.error('Response was:', JSON.stringify(data, null, 2));
        setError('Erro: Token não recebido do servidor. Tente novamente.');
        setLoading(false);
        return;
      }
      
      // Armazenar token (already stored in authService, but do it again for safety)
      localStorage.setItem('access_token', data.access_token);
      
      // Armazenar user data se disponível
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      console.log('✅ Token stored successfully');
      console.log('🚀 Redirecting to dashboard...');
      
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.message || 'Erro de conexão. Tente novamente.';
      setError(errorMsg);
      console.error('❌ Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">
          Blade Billing
        </h1>
        <p className="text-gray-600 text-center mb-6">Fazer login na sua conta</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link
            to="/cadastre-se"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
