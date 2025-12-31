import api from '../../lib/api';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import React, { useState } from 'react';

export default function NewClientModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/clients', { name, email, phone });
      toast({ title: 'Cliente cadastrado!' });   // Corrigido! Espera objeto
      setOpen(false);
      setName('');
      setEmail('');
      setPhone('');
    } catch {
      toast({ title: 'Erro ao cadastrar cliente!' }); // Corrigido! Espera objeto
    }
    setLoading(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Novo Cliente</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="dialog-content">
          <h2 className="dialog-title">Novo Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name">Nome:</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email">Email:</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="phone">Telefone:</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="ml-2"
            >
              Cancelar
            </Button>
          </form>
        </div>
      </Dialog>
    </>
  );
}
