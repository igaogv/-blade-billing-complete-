import React, { useEffect, useState } from 'react';

interface Payment {
  id: string;
  clientName: string;
  value: number;
  dueDate: string;
  status: string;
}

const Pagamentos: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/payments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          setError(`Erro ao buscar pagamentos: ${res.status} ${res.statusText}`);
          setPayments([]);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data)) {
          setPayments(data);
        } else if (Array.isArray(data.payments)) {
          setPayments(data.payments);
        } else {
          setPayments([]);
          setError("Nenhum dado de pagamento retornado.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Falha na requisição: ${err}`);
        setPayments([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pagamentos</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Novo Pagamento
        </button>
      </div>
      {error && (
        <div className="text-red-600 font-semibold mb-4">{error}</div>
      )}
      <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">{JSON.stringify(payments, null, 2)}</pre>
      {loading ? (
        <div>Carregando...</div>
      ) : payments.length === 0 ? (
        <div>Nenhum pagamento registrado.</div>
      ) : (
        <table className="w-full border rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Cliente</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Vencimento</th>
              <th className="p-2">Status</th>
              <th className="p-2">Opções</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{payment.clientName}</td>
                <td className="p-2">{payment.value}</td>
                <td className="p-2">{payment.dueDate}</td>
                <td className="p-2">{payment.status}</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline">Cobrar via WhatsApp</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Pagamentos;
