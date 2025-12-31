import { authService } from '../services/auth';
import { useState } from 'react';

export function TestConnection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const testLogin = async () => {
    setLoading(true);
    try {
      // Teste com um email/senha que você sabe que existe no seu banco
      const response = await authService.login('admin@example.com', 'password123');
      setResult('✅ LOGIN FUNCIONOU! ' + JSON.stringify(response));
    } catch (error: any) {
      setResult('❌ Erro: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid red' }}>
      <h2>Teste de Conexão Backend</h2>
      <button onClick={testLogin} disabled={loading}>
        {loading ? 'Testando...' : 'Testar Login'}
      </button>
      <pre>{result}</pre>
    </div>
  );
}
