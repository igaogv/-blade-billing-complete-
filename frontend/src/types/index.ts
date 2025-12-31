// Caminho: src/types/index.ts

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  notes?: string;
}

// Podemos adicionar outros tipos aqui no futuro, como Billing