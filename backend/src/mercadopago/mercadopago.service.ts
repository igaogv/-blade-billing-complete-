import { MercadoPagoConfig, Payment } from 'mercadopago';

// ATENÇÃO: Carregue variáveis do .env no início da aplicação (no main.ts ou AppModule), usando dotenv/config do Nest!
const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
const payment = new Payment(mp);

export async function gerarBoleto(cliente, valor, vencimento) {
  const payment_data = {
    transaction_amount: Number(valor),
    description: `Cobrança SaaS - vencimento ${vencimento}`,
    payment_method_id: 'bolbradesco',
    payer: {
      email: cliente.email,
      first_name: cliente.nome,
      identification: {
        type: 'CPF',
        number: cliente.cpf,
      },
    },
  };

  try {
    const pagamento = await payment.create({ body: payment_data });
    return pagamento.transaction_details.external_resource_url; // Link real do boleto
  } catch (err) {
    console.error('Erro MercadoPago:', err.response?.data || err);
    throw err;
  }
}
