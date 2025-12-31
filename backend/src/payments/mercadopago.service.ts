import { MercadoPagoConfig, Payment } from 'mercadopago';

const mp = new MercadoPagoConfig({
  accessToken: 'TEST-5291162886827885-110507-06d869f20f07164b570f7dac5769b500-1212160964',
});
const payment = new Payment(mp);

export async function gerarBoleto(cliente, valor, vencimento) {
  // Separação de nome e sobrenome
  let first_name = cliente.nome;
  let last_name = cliente.sobrenome || '';
  if (!last_name && first_name) {
    const partes = first_name.trim().split(' ');
    first_name = partes[0];
    last_name = partes.slice(1).join(' ') || 'Teste';
  }

  // CPF limpo
  const cpf = String(cliente.cpf).replace(/[^\d]/g, '');

  // Montagem do payment_data com endereço
  const payment_data = {
    transaction_amount: Number(valor),
    description: `Mensalidade SaaS - vencimento ${vencimento}`,
    payment_method_id: 'bolbradesco',
    payer: {
      email: cliente.email,
      first_name,
      last_name,
      identification: {
        type: 'CPF',
        number: cpf,
      },
      address: {
        zip_code: cliente.cep || '01001-000',
        street_name: cliente.rua || 'Praça da Sé',
        street_number: cliente.numero || '100',
        neighborhood: cliente.bairro || 'Sé',
        city: cliente.cidade || 'São Paulo',
        federal_unit: cliente.estado || 'SP',
      }
    },
  };

  try {
    const pagamento = await payment.create({ body: payment_data });
    return pagamento.transaction_details.external_resource_url;
  } catch (err) {
    console.error('Erro MercadoPago:', err?.response?.data || err, payment_data);
    throw err;
  }
}
