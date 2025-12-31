import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';

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
      console.log('📊 Dashboard stats response:', response.data);
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Carregando dados do dashboard...</div>;
  }

  if (isError || !stats) {
    return (
      <div className="p-8 text-red-600">
        Erro ao carregar dados do dashboard.
      </div>
    );
  }

  // Safety fallbacks for undefined values
  const totalReceived = stats.totalReceived ?? 0;
  const totalPending = stats.totalPending ?? 0;

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
        <span className="text-sm text-gray-500">Total de Clientes</span>
        <span className="text-3xl font-semibold">{stats.totalClients ?? 0}</span>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
        <span className="text-sm text-gray-500">Total de Cobranças</span>
        <span className="text-3xl font-semibold">{stats.totalInvoices ?? 0}</span>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
        <span className="text-sm text-gray-500">Total Recebido</span>
        <span className="text-3xl font-semibold text-emerald-600">
          R$ {typeof totalReceived === 'number' ? totalReceived.toFixed(2) : '0.00'}
        </span>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
        <span className="text-sm text-gray-500">Total Pendente</span>
        <span className="text-3xl font-semibold text-red-600">
          R$ {typeof totalPending === 'number' ? totalPending.toFixed(2) : '0.00'}
        </span>
      </div>
    </div>
  );
}
