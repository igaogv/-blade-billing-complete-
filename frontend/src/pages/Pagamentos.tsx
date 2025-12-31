import DashboardLayout from '../components/DashboardLayout';

export default function PagamentosPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-extrabold text-navy mb-6">Pagamentos</h1>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <p className="text-gray-500">Aqui estará a tabela e as ações de pagamentos.</p>
      </div>
    </DashboardLayout>
  );
}
