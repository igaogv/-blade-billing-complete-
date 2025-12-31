import axios from 'axios';

async function sendWhatsApp() {
  const ACCESS_TOKEN = 'EAAKnRizUTJEBP1ifcBJ71WkM4OZBvBTpnTTfjU4Osnpnb0hrFwwbePDDiJeVyXqI4YIWyLNRAib92Asgagy6dZA5Oop1fZALd85K8kEQHCGjOkV47Du4mDIMRKFENPBTxcChEHD8Gh5ZApAZAzogLKM2XdIlZBySEy3ScymOZA4LIKYiulM3Q4soCMWUCX1gFjkaRrQqEMfs0mb5JPxOPZC3RoWevHc0aYXDHax9xWdUBZC68hPCecHwYTIr6G6A1B0Toc6fGAeglQHm25Q1gNvmgOgfR';
  const PHONE_NUMBER_ID = '829891193544850';
  const recipientNumber = '5519999544387'; // ex: '5511999999999'

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'text',
        text: { body: 'Seu SaaS está enviando pelo WhatsApp Cloud API!' },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ Mensagem enviada com sucesso!', response.data);
  } catch (error: any) {
    console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
  }
}

sendWhatsApp();
