import { useEffect, useState } from 'react';
import { API_ENDPOINTS, apiFetch } from '../config/api';
import './Dashboard.css';

interface DashboardStats {
  totalClients?: number;
  totalInvoices?: number;
  totalPayments?: number;
  totalAppointments?: number;
  recentActivity?: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<DashboardStats>(
          API_ENDPOINTS.DASHBOARD.STATS
        );
        setStats(data);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar dados do dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-main">
      <nav className="dashboard-nav">
        <h2>Blade Billing - Painel</h2>
        <ul>
          <li>
            <a href="/painel/clientes">Clientes</a>
          </li>
          <li>
            <a href="/painel/pagamentos">Pagamentos</a>
          </li>
          <li>
            <a href="/painel/agendamentos">Agendamentos</a>
          </li>
        </ul>
      </nav>
      <section className="dashboard-content">
        <div className="dashboard-welcome">
          <h3>
            Bem-vindo, <span>Usuário!</span>
          </h3>
          <p>Use o menu acima para navegar.</p>
        </div>

        {loading && <div className="loading">Carregando dados...</div>}

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {stats && !loading && (
          <div className="dashboard-stats">
            <div className="stat-card">
              <h4>Total de Clientes</h4>
              <p className="stat-number">{stats.totalClients || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Total de Faturas</h4>
              <p className="stat-number">{stats.totalInvoices || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Total de Pagamentos</h4>
              <p className="stat-number">{stats.totalPayments || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Total de Agendamentos</h4>
              <p className="stat-number">{stats.totalAppointments || 0}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
