// frontend/src/pages/dashboard/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  totalReceived: number;
  totalPending: number;
}

export default function Dashboard() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (isError || !stats) {
    return (
      <div className="p-8 text-red-600">
        Erro ao carregar dados do dashboard.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total de Clientes</p>
          <p className="text-3xl font-bold">{stats.totalClients}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total de Cobranças</p>
          <p className="text-3xl font-bold">{stats.totalInvoices}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total Recebido</p>
          <p className="text-3xl font-bold text-green-600">
            R$ {stats.totalReceived.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total Pendente</p>
          <p className="text-3xl font-bold text-red-600">
            R$ {stats.totalPending.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
