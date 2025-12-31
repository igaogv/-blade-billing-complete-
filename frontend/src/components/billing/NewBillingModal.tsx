import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Definindo a interface para um Cliente (apenas o necessário para o dropdown)
interface Client {
  id: string;
  name: string;
}

interface NewBillingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Função para buscar a lista de clientes para o dropdown
const fetchClients = async (): Promise<Client[]> => {
  const { data } = await api.get("/clients");
  return data;
};

// Função que envia os dados da nova cobrança para a API
const createBilling = async (newBillingData: {
  clientId: string;
  amount: number;
  dueDate: string;
}) => {
  const { data } = await api.post("/billing", newBillingData);
  return data;
};

export const NewBillingModal = ({ open, onOpenChange }: NewBillingModalProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Busca a lista de clientes para popular o Select
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: fetchClients,
    enabled: open, // Só busca os clientes quando o modal está aberto
  });
  
  // Hook de mutação para criar a cobrança
  const mutation = useMutation({
    mutationFn: createBilling,
    onSuccess: () => {
      // Invalida a query de cobranças para forçar a atualização da lista
      queryClient.invalidateQueries({ queryKey: ['billings'] });
      toast({
        title: "Sucesso!",
        description: "Cobrança criada e agendada.",
      });
      onOpenChange(false); // Fecha o modal
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a cobrança.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      clientId,
      amount: parseFloat(amount),
      dueDate,
    });
  };

  // Limpa o formulário quando o modal fecha
  useEffect(() => {
    if (!open) {
      setClientId("");
      setAmount("");
      setDueDate("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Cobrança</DialogTitle>
          <DialogDescription>
            Crie uma nova cobrança para um cliente existente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente *</Label>
            <Select onValueChange={setClientId} value={clientId} required>
              <SelectTrigger id="client">
                <SelectValue placeholder={isLoadingClients ? "Carregando..." : "Selecione um cliente"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="89.90"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-gradient-primary">
              {mutation.isPending ? "Criando..." : "Criar Cobrança"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};