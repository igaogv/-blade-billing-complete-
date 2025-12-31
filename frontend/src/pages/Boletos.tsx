import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

interface Boleto {
  id: string;
  value: number;
  dueDate: string;
  status: string;
  client: {
    name: string;
    email: string;
  };
}

export default function Boletos() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invoices')
      .then((response) => {
        setBoletos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar boletos:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando boletos...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Boletos Emitidos</h1>
      
      {boletos.length === 0 ? (
        <p>Nenhum boleto cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Valor</th>
              <th className="border p-2">Vencimento</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {boletos.map((boleto) => (
              <tr key={boleto.id}>
                <td className="border p-2">{boleto.client.name}</td>
                <td className="border p-2">R$ {boleto.value.toFixed(2)}</td>
                <td className="border p-2">
                  {new Date(boleto.dueDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="border p-2">{boleto.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
