import DashboardLayout from '../components/DashboardLayout';

export default function Billings() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-extrabold text-navy mb-6">Cobranças</h1>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <p className="text-gray-500">Aqui estará a tabela e as ações de cobranças/faturamento.</p>
        <table className="min-w-full mt-6 border bg-white shadow rounded-xl text-gray-800">
          <thead className="bg-navy text-white">
            <tr>
              <th className="p-3">Cliente</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Status</th>
              <th className="p-3">Data</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-blue-50">
              <td className="p-3">João Silva</td>
              <td className="p-3">R$ 150,00</td>
              <td className="p-3">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">Pago</span>
              </td>
              <td className="p-3">08/11/2025</td>
              <td className="p-3">
                <button className="text-accent underline">Detalhes</button>
              </td>
            </tr>
            <tr className="border-b hover:bg-blue-50">
              <td className="p-3">Ana Lima</td>
              <td className="p-3">R$ 90,00</td>
              <td className="p-3">
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Pendente</span>
              </td>
              <td className="p-3">10/11/2025</td>
              <td className="p-3">
                <button className="text-accent underline">Detalhes</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
