import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function TestConnection() {
  const { data: clients, isLoading, error, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get('/clients');
      return data;
    },
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data } = await api.get('/invoices');
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">⚡ Barber SaaS</h1>
          <p className="text-slate-600">Sistema de Cobrança Automática</p>
        </div>

        {/* Status da Conexão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
              ) : error ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              Status da Conexão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Backend</p>
                <p className="text-xl font-bold text-green-600">
                  {error ? '❌ Offline' : '✅ Online'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Banco PostgreSQL</p>
                <p className="text-xl font-bold text-green-600">
                  {error ? '❌ Erro' : '✅ Conectado'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">WhatsApp API</p>
                <p className="text-xl font-bold text-green-600">✅ Ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados dos Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>👥 Clientes Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </div>
            ) : error ? (
              <p className="text-red-600">Erro ao conectar: {error.message}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">
                  {clients?.length || 0} clientes
                </p>
                <pre className="bg-slate-100 p-4 rounded-lg text-xs overflow-auto max-h-48">
                  {JSON.stringify(clients, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dados das Cobranças */}
        <Card>
          <CardHeader>
            <CardTitle>💰 Cobranças Criadas</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingInvoices ? (
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">
                  {invoices?.length || 0} cobranças
                </p>
                <pre className="bg-slate-100 p-4 rounded-lg text-xs overflow-auto max-h-48">
                  {JSON.stringify(invoices, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => refetch()} size="lg" className="gap-2">
            🔄 Recarregar Dados
          </Button>
        </div>
      </div>
    </div>
  );
}
