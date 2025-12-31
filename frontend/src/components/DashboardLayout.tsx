export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-polished">
      <aside className="w-60 bg-primary text-white flex flex-col px-6 py-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-10 tracking-tight">
          Blade<span className="text-accent">Billing</span>
        </h2>
        <nav className="flex flex-col gap-4">
          <a href="/dashboard" className="hover:text-accent">Dashboard</a>
          <a href="/clientes" className="hover:text-accent">Clientes</a>
          <a href="/pagamentos" className="hover:text-accent">Pagamentos</a>
          <a href="/agendamentos" className="hover:text-accent">Agendamentos</a>
          <a href="/billings" className="hover:text-accent">Cobranças</a>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
