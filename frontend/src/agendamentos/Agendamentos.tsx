import React, { useEffect, useState } from 'react';

interface Appointment {
  id: string;
  clientName: string;
  date: string;
  hour: string;
  service: string;
  status: string;
}

const Agendamentos: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/appointments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : data.appointments || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setAppointments([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Agendamentos</h2>
      {error && (
        <div className="text-red-600">Erro: {error}</div>
      )}
      <pre className="mb-4">{JSON.stringify(appointments, null, 2)}</pre>
      {loading ? (
        <div>Carregando...</div>
      ) : appointments.length === 0 ? (
        <div>Nenhum agendamento registrado.</div>
      ) : (
        <table className="w-full border rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Cliente</th>
              <th className="p-2">Data</th>
              <th className="p-2">Hora</th>
              <th className="p-2">Serviço</th>
              <th className="p-2">Status</th>
              <th className="p-2">Opções</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((ag) => (
              <tr key={ag.id}>
                <td className="p-2">{ag.clientName}</td>
                <td className="p-2">{ag.date}</td>
                <td className="p-2">{ag.hour}</td>
                <td className="p-2">{ag.service}</td>
                <td className="p-2">{ag.status}</td>
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

export default Agendamentos;
