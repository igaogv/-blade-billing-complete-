import DashboardLayout from '../components/DashboardLayout';

export default function AgendamentosPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-extrabold text-navy mb-6">Agendamentos</h1>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <p className="text-gray-500">Aqui estará a tabela e as ações de agendamentos.</p>
      </div>
    </DashboardLayout>
  );
}
