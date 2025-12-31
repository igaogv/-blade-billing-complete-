import { useState, useEffect } from 'react';
import axios from 'axios';

interface Client {
  id: string;
  name: string;
  phone: string;
}

interface Invoice {
  id: string;
  value: number;
  dueDate: string;
  status: string;
  boletoUrl?: string;
  pixQrCode?: string;
  client: Client;
  createdAt: string;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    dueDate: ''
  });

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(response.data);
    } catch (error) {
      console.error('Erro ao buscar faturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/invoices`,
        {
          clientId: formData.clientId,
          amount: parseFloat(formData.amount),
          dueDate: formData.dueDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFormData({ clientId: '', amount: '', dueDate: '' });
      setShowModal(false);
      fetchInvoices();
      alert('Fatura criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
      alert('Erro ao criar fatura');
    }
  };

  // ← NOVA FUNÇÃO PARA DELETAR
  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`Tem certeza que deseja deletar a fatura de ${clientName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvoices();
      alert('Fatura deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar fatura:', error);
      alert('Erro ao deletar fatura');
    }
  };

  const handleSendWhatsApp = async (invoice: Invoice) => {
    let message = `Olá ${invoice.client.name}! 

Sua fatura de *R$ ${invoice.value.toFixed(2)}* está disponível.
Vencimento: ${new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
Status: ${invoice.status === 'pending' ? 'Pendente' : 'Pago'}`;

    if (invoice.pixQrCode) {
      message += `\n\n*PIX Copia e Cola:*\n${invoice.pixQrCode}`;
    }

    if (invoice.boletoUrl) {
      message += `\n\n*Link de pagamento:*\n${invoice.boletoUrl}`;
    }

    const whatsappUrl = `https://wa.me/${invoice.client.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paga';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Faturas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas faturas e cobranças</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Nova Fatura
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Nova Fatura</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimento
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Criar Fatura
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma fatura criada</p>
          <p className="text-gray-400 mt-2">Clique em "Nova Fatura" para começar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{invoice.client.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    R$ {invoice.value.toFixed(2)}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Vencimento: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 border ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getStatusText(invoice.status)}
                  </span>

                  {invoice.pixQrCode && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">PIX Copia e Cola:</p>
                      <p className="text-xs text-gray-700 font-mono break-all">{invoice.pixQrCode}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(invoice.pixQrCode!);
                          alert('Código PIX copiado!');
                        }}
                        className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Copiar Código PIX
                      </button>
                    </div>
                  )}
                </div>

                {/* BOTÕES: WhatsApp e Deletar */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendWhatsApp(invoice)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium"
                  >
                    Enviar WhatsApp
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id, invoice.client.name)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
