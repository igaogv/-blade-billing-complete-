import { api } from '../api';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export const clientsService = {
  getAll: () => api.get<Client[]>('/clients'),
  getById: (id: string) => api.get<Client>(`/clients/${id}`),
  create: (data: { name: string; email: string; phone: string }) =>
    api.post<Client>('/clients', data),
  update: (id: string, data: Partial<{ name: string; email: string; phone: string }>) =>
    api.put<Client>(`/clients/${id}`, data),
  delete: (id: string) => api.delete<void>(`/clients/${id}`),
};
