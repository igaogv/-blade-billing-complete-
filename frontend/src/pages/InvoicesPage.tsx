import { useState, useEffect } from 'react';
import { invoicesService, clientsService } from '../services/api';


type Invoice = {
  id: string;
  clientId: string;
  client: {
    name: string;
    phone: string;
  };
  value: number;
  status: string;
  dueDate: string;
  pixQrCode?: string;
};


type Client = {
  id: string;
  name: string;
  phone: string;
};


export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    value: '',
    dueDate: '',
  });


  useEffect(() => {
    loadInvoices();
    loadClients();
  }, []);


  async function loadInvoices() {
    try {
      const data = await invoicesService.findAll();
      setInvoices(data);
    } catch (error) {
      console.error('Erro ao carregar cobranças:', error);
      alert('Erro ao carregar cobranças');
    } finally {
      setLoading(false);
    }
  }


  async function loadClients() {
    try {
      const data = await clientsService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }


  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();


    if (!formData.clientId || !formData.value || !formData.dueDate) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }


    try {
      await invoicesService.create({
        clientId: formData.clientId,
        value: parseFloat(formData.value),
        dueDate: new Date(formData.dueDate).toISOString(),
      });


      alert('Cobrança criada com sucesso! PIX gerado automaticamente pelo Mercado Pago.');
      setShowModal(false);
      setFormData({ clientId: '', value: '', dueDate: '' });
      loadInvoices();
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
      alert('Erro ao criar cobrança. Verifique o token do Mercado Pago.');
    }
  }


  async function handleSendWhatsapp(invoice: Invoice) {
    try {
      // 1. Enviar a mensagem pelo WhatsApp (backend)
      await invoicesService.sendWhatsapp(invoice.id);
      
      // 2. Abrir o WhatsApp no navegador com a mensagem
      const mensagem = `Olá ${invoice.client.name}! 🔔\n\nVocê tem uma cobrança de R$ ${invoice.value.toFixed(2)} vencendo em ${new Date(invoice.dueDate).toLocaleDateString('pt-BR')}.\n\nPIX QR Code:\n${invoice.pixQrCode}`;
      
      const numero = invoice.client.phone.replace(/\D/g, ''); // Remove caracteres especiais
      const urlWhatsapp = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
      
      // Abre em nova aba
      window.open(urlWhatsapp, '_blank');
      
      alert('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      alert('Erro ao enviar mensagem. Verifique o console.');
    }
  }


  async function handleDelete(invoiceId: string) {
    if (!confirm('Tem certeza que deseja excluir esta cobrança?')) return;
    
    try {
      await invoicesService.delete(invoiceId);
      alert('Cobrança excluída!');
      loadInvoices();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir cobrança');
    }
  }


  if (loading) return <div>Carregando...</div>;


  const totalPendentes = invoices.filter(inv => inv.status === 'PENDING').length;
  const totalPagas = invoices.filter(inv => inv.status === 'PAID').length;
  const totalRecebido = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.value, 0);


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cobranças</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nova Cobrança
        </button>
      </div>


      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold">{invoices.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-orange-600">{totalPendentes}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Pagas</p>
          <p className="text-2xl font-bold text-green-600">{totalPagas}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Total Recebido</p>
          <p className="text-2xl font-bold text-green-600">R$ {totalRecebido.toFixed(2)}</p>
        </div>
      </div>


      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-600">CLIENTE</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">VALOR</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">VENCIMENTO</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">STATUS</th>
              <th className="text-right p-4 text-sm font-medium text-gray-600">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{invoice.client.name}</div>
                  <div className="text-sm text-gray-500">Cobrança</div>
                </td>
                <td className="p-4 font-medium">R$ {invoice.value.toFixed(2)}</td>
                <td className="p-4">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {invoice.status === 'PAID' ? 'Paga' : 'Pendente'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleSendWhatsapp(invoice)} className="text-green-600 hover:text-green-900 font-medium">
                    Enviar WhatsApp
                  </button>
                  <button onClick={() => handleDelete(invoice.id)} className="text-red-600 hover:text-red-900 font-medium">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        {invoices.length === 0 && (
          <div className="text-center py-12 text-gray-500">Nenhuma cobrança cadastrada</div>
        )}
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Nova Cobrança</h2>
            <form onSubmit={handleCreateInvoice}>
              <div className="mb-4">
                <label htmlFor="clientId" className="block text-sm font-medium mb-2">Cliente *</label>
                <select id="clientId" value={formData.clientId} onChange={(e) => setFormData({...formData, clientId: e.target.value})} className="w-full border rounded px-3 py-2" required>
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>


              <div className="mb-4">
                <label htmlFor="value" className="block text-sm font-medium mb-2">Valor (R$) *</label>
                <input id="value" type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full border rounded px-3 py-2" placeholder="0.00" required />
              </div>


              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium mb-2">Data de Vencimento *</label>
                <input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full border rounded px-3 py-2" required />
              </div>


              <p className="text-sm text-gray-500 mb-4">💡 O código PIX será gerado automaticamente pelo Mercado Pago</p>


              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Criar Cobrança
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
