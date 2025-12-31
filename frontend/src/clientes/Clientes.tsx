import React, { useEffect, useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const Clientes: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Recupera o token salvo no login
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/clients', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Dados recebidos (CLIENTES):', data);
        // Aceita tanto array direto quanto objeto com propriedade "clients"
        setClients(Array.isArray(data) ? data : data.clients || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro no fetch (CLIENTES):', err);
        setClients([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Novo Cliente
        </button>
      </div>
      <pre>{JSON.stringify(clients, null, 2)}</pre>
      {loading ? (
        <div>Carregando...</div>
      ) : clients.length === 0 ? (
        <div>Nenhum cliente registrado.</div>
      ) : (
        <table className="w-full border rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Nome</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Opções</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{client.name}</td>
                <td className="p-2">{client.phone}</td>
                <td className="p-2">{client.email}</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Clientes;
