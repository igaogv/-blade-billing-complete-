import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface User {
  name: string;
  photoUrl?: string;
}

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Simulação de usuário - substitua pela sua lógica real de autenticação
  const user: User | null = {
    name: "Usuário Exemplo",
    photoUrl: undefined, // ou a URL da foto se houver
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
