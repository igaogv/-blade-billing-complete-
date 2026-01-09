import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

interface DashboardData {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  totalClients: number;
  totalAppointments: number;
  todayAppointments: number;
  appointmentsThisMonth: number;
  revenueGrowth: number;
  conversionRate: number;
  topServices: Array<{ name: string; revenue: number; count: number }>;
  recentInvoices: Array<{
    id: string;
    clientName: string;
    amount: number;
    status: string;
    dueDate: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    clientName: string;
    service: string;
    time: string;
    phone: string;
  }>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    totalClients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    appointmentsThisMonth: 0,
    revenueGrowth: 0,
    conversionRate: 0,
    topServices: [],
    recentInvoices: [],
    upcomingAppointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch all necessary data in parallel
      const [invoicesRes, appointmentsRes, clientsRes, dashboardRes] =
        await Promise.all([
          api.get('/invoices', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/appointments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/clients', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: {} })),
        ]);

      const invoices = invoicesRes.data || [];
      const appointments = appointmentsRes.data || [];
      const clients = clientsRes.data || [];
      const dashboardData = dashboardRes.data || {};

      // Calculate metrics
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Revenue calculations
      const totalRev = invoices.reduce(
        (sum: number, inv: any) => sum + (inv.amount || 0),
        0,
      );
      const monthlyRev = invoices
        .filter((inv: any) => {
          const invDate = new Date(inv.createdAt || inv.issuedDate);
          return (
            invDate.getMonth() === currentMonth &&
            invDate.getFullYear() === currentYear
          );
        })
        .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

      // Pending payments
      const pending = invoices.filter(
        (inv: any) => inv.paymentStatus === 'pending' || inv.paymentStatus === 'unpaid'
      ).length;
      const pendingAmount = invoices
        .filter((inv: any) => inv.paymentStatus === 'pending')
        .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

      // Appointment metrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAppts = appointments.filter((apt: any) => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      }).length;

      const monthlyAppts = appointments.filter((apt: any) => {
        const aptDate = new Date(apt.appointmentDate);
        return (
          aptDate.getMonth() === currentMonth &&
          aptDate.getFullYear() === currentYear
        );
      }).length;

      // Growth calculations (comparing with previous month)
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const prevMonthRev = invoices
        .filter((inv: any) => {
          const invDate = new Date(inv.createdAt || inv.issuedDate);
          return (
            invDate.getMonth() === lastMonth.getMonth() &&
            invDate.getFullYear() === lastMonth.getFullYear()
          );
        })
        .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

      const growth =
        prevMonthRev > 0
          ? ((monthlyRev - prevMonthRev) / prevMonthRev) * 100
          : 0;

      // Top services
      const serviceMap: Record<string, { revenue: number; count: number }> =
        {};
      invoices.forEach((inv: any) => {
        const service = inv.service || 'Outros';
        if (!serviceMap[service]) {
          serviceMap[service] = { revenue: 0, count: 0 };
        }
        serviceMap[service].revenue += inv.amount || 0;
        serviceMap[service].count++;
      });

      const topServices = Object.entries(serviceMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Recent invoices (last 5)
      const recentInvoices = invoices
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt || b.issuedDate).getTime() -
            new Date(a.createdAt || a.issuedDate).getTime(),
        )
        .slice(0, 5)
        .map((inv: any) => ({
          id: inv.id,
          clientName: inv.clientName || 'Desconhecido',
          amount: inv.amount || 0,
          status: inv.paymentStatus || 'pending',
          dueDate: inv.dueDate || inv.createdAt,
        }));

      // Upcoming appointments (next 7 days)
      const next7Days = new Date();
      next7Days.setDate(next7Days.getDate() + 7);

      const upcomingAppointments = appointments
        .filter((apt: any) => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && aptDate <= next7Days;
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.appointmentDate).getTime() -
            new Date(b.appointmentDate).getTime(),
        )
        .slice(0, 5)
        .map((apt: any) => ({
          id: apt.id,
          clientName: apt.clientName || 'Desconhecido',
          service: apt.service || 'Serviço',
          time: apt.appointmentDate
            ? new Date(apt.appointmentDate).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '--:--',
          phone: apt.clientPhone || '--',
        }));

      setData({
        totalRevenue: totalRev,
        monthlyRevenue: monthlyRev,
        pendingPayments: pendingAmount,
        totalClients: clients.length,
        totalAppointments: appointments.length,
        todayAppointments: todayAppts,
        appointmentsThisMonth: monthlyAppts,
        revenueGrowth: growth,
        conversionRate: clients.length > 0 ? (monthlyAppts / (clients.length * 2)) * 100 : 0,
        topServices,
        recentInvoices,
        upcomingAppointments,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {error && <div className="error-banner">{error}</div>}

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Bem-vindo! Aqui está um resumo do seu negócio.
          </p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="action-btn primary"
          onClick={() => navigate('/agendamentos')}
        >
          <span className="icon">📅</span>
          <span>Novo Agendamento</span>
        </button>
        <button
          className="action-btn secondary"
          onClick={() => navigate('/clientes')}
        >
          <span className="icon">👤</span>
          <span>Novo Cliente</span>
        </button>
        <button
          className="action-btn secondary"
          onClick={() => navigate('/pagamentos')}
        >
          <span className="icon">💳</span>
          <span>Registrar Pagamento</span>
        </button>
        <button
          className="action-btn secondary"
          onClick={() => navigate('/pagamentos')}
        >
          <span className="icon">📄</span>
          <span>Gerar Fatura</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card primary">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <p className="kpi-label">Receita Total</p>
            <p className="kpi-value">
              R$ {data.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="kpi-subtext">Todos os tempos</p>
          </div>
        </div>

        <div className="kpi-card secondary">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <p className="kpi-label">Receita Mês</p>
            <p className="kpi-value">
              R$ {data.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className={`kpi-subtext ${data.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth.toFixed(1)}% vs mês anterior
            </p>
          </div>
        </div>

        <div className="kpi-card danger">
          <div className="kpi-icon">⚠️</div>
          <div className="kpi-content">
            <p className="kpi-label">Pagamentos Pendentes</p>
            <p className="kpi-value">
              R$ {data.pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="kpi-subtext">{data.recentInvoices.filter(i => i.status === 'pending').length} faturas</p>
          </div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-icon">📅</div>
          <div className="kpi-content">
            <p className="kpi-label">Agendamentos Hoje</p>
            <p className="kpi-value">{data.todayAppointments}</p>
            <p className="kpi-subtext">{data.appointmentsThisMonth} este mês</p>
          </div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <p className="kpi-label">Clientes Ativos</p>
            <p className="kpi-value">{data.totalClients}</p>
            <p className="kpi-subtext">Taxa conversão: {data.conversionRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">✂️</div>
          <div className="kpi-content">
            <p className="kpi-label">Total Serviços</p>
            <p className="kpi-value">{data.topServices.length}</p>
            <p className="kpi-subtext">Serviços oferecidos</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Top Services */}
        <div className="dashboard-card">
          <h3>🏆 Serviços Mais Lucrativos</h3>
          <div className="service-list">
            {data.topServices.length > 0 ? (
              data.topServices.map((service) => (
                <div key={service.name} className="service-item">
                  <div className="service-info">
                    <p className="service-name">{service.name}</p>
                    <p className="service-count">{service.count} vendas</p>
                  </div>
                  <div className="service-revenue">
                    R$ {service.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Nenhum serviço registrado</p>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📄 Últimas Faturas</h3>
            <a href="/pagamentos" className="view-all">Ver todas →</a>
          </div>
          <div className="invoice-list">
            {data.recentInvoices.length > 0 ? (
              data.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="invoice-item">
                  <div className="invoice-info">
                    <p className="invoice-client">{invoice.clientName}</p>
                    <p className="invoice-date">
                      {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="invoice-amount">
                    <span className="amount">
                      R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`status ${invoice.status}`}>
                      {invoice.status === 'pending' || invoice.status === 'unpaid' ? '⏳ Pendente' : '✅ Pago'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Nenhuma fatura registrada</p>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📅 Próximos Agendamentos</h3>
            <a href="/agendamentos" className="view-all">Ver agenda →</a>
          </div>
          <div className="appointment-list">
            {data.upcomingAppointments.length > 0 ? (
              data.upcomingAppointments.map((apt) => (
                <div key={apt.id} className="appointment-item">
                  <div className="apt-time">{apt.time}</div>
                  <div className="apt-info">
                    <p className="apt-client">{apt.clientName}</p>
                    <p className="apt-service">{apt.service}</p>
                    <p className="apt-phone">📞 {apt.phone}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Nenhum agendamento próximo</p>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="alerts-section">
        <h3>⚠️ Atenção</h3>
        <div className="alerts-list">
          {data.pendingPayments > 0 && (
            <div className="alert-item warning">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <p className="alert-title">Pagamentos Pendentes</p>
                <p className="alert-message">
                  Você tem R$ {data.pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em pagamentos pendentes
                </p>
              </div>
              <button
                className="alert-action"
                onClick={() => navigate('/pagamentos')}
              >
                Cobrar →
              </button>
            </div>
          )}
          {data.todayAppointments > 0 && (
            <div className="alert-item info">
              <span className="alert-icon">📅</span>
              <div className="alert-content">
                <p className="alert-title">Agendamentos Hoje</p>
                <p className="alert-message">
                  Você tem {data.todayAppointments} agendamentos marcados para hoje
                </p>
              </div>
              <button
                className="alert-action"
                onClick={() => navigate('/agendamentos')}
              >
                Ver →
              </button>
            </div>
          )}
          {data.recentInvoices.filter(i => i.status === 'pending').length > 3 && (
            <div className="alert-item danger">
              <span className="alert-icon">🔔</span>
              <div className="alert-content">
                <p className="alert-title">Muitos Pagamentos Pendentes</p>
                <p className="alert-message">
                  Mais de 3 faturas sem pagamento. Recomendamos enviar lembretes aos clientes.
                </p>
              </div>
              <button
                className="alert-action"
                onClick={() => navigate('/pagamentos')}
              >
                Ação →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
