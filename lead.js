// api/lead.js
// Função serverless para Vercel — recebe o lead do formulário e envia por e-mail via Resend.
// Nenhuma chave de API fica exposta no front-end: tudo é lido de variáveis de ambiente.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { nome, whatsapp, email, cidade, segmento, servico, horario } = req.body;

    // Validação simples dos campos obrigatórios
    if (!nome || !whatsapp || !email || !cidade || !segmento || !servico || !horario) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const LEAD_TO_EMAIL = process.env.LEAD_TO_EMAIL || 'davisignalbr@gmail.com';
    const LEAD_FROM_EMAIL = process.env.LEAD_FROM_EMAIL || 'Lead Signal <noreply@seudominio.com.br>';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY não configurada.');
      return res.status(500).json({ error: 'Configuração de e-mail ausente.' });
    }

    const emailBody = `
      <h2>Novo lead — Mapa de Crescimento</h2>
      <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Cidade/Estado:</strong> ${escapeHtml(cidade)}</p>
      <p><strong>Segmento:</strong> ${escapeHtml(segmento)}</p>
      <p><strong>Serviço de interesse:</strong> ${escapeHtml(servico)}</p>
      <p><strong>Melhor horário para contato:</strong> ${escapeHtml(horario)}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL,
        to: [LEAD_TO_EMAIL],
        subject: `Novo lead — ${nome} (${segmento})`,
        html: emailBody
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro ao enviar e-mail via Resend:', errText);
      return res.status(502).json({ error: 'Não foi possível enviar o lead. Tente novamente.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Erro inesperado em /api/lead:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente em instantes.' });
  }
}

// Sanitização básica para evitar HTML injection no corpo do e-mail
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
