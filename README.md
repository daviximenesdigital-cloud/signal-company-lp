# Signal Company — Landing Page

Landing page de Davi Ximenes / Signal Company para captação de leads (Mapa de Crescimento).

## Estrutura de pastas

```
signal-company/
├── index.html                    → página principal
├── obrigado.html                 → página pós-formulário (redireciona pro Google Calendar)
├── politica-de-privacidade.html  → política de privacidade
├── api/
│   └── lead.js                   → função serverless (Vercel) que envia o lead por e-mail
├── .env.example                  → modelo das variáveis de ambiente
└── README.md                     → este arquivo
```

---

## 1. O que substituir antes de publicar

- **Fotos**: o hero, a seção "Sobre" e os 6 cases têm blocos de placeholder claramente marcados com comentários `<!-- Substituir por foto... -->` no HTML. Troque os `div.photo-placeholder` e `div.case-shot` pelas suas fotos reais (use `<img>` com `loading="lazy"` nos cases, que ficam abaixo da primeira dobra).
- **Domínio**: troque `seudominio.com.br` em `<link rel="canonical">`, nas tags Open Graph e no schema JSON-LD pelo domínio real.
- **Favicon**: substitua `/favicon.ico` por um arquivo real.
- **og-image.jpg**: crie uma imagem de 1200×630px para compartilhamento em redes sociais.
- **GTM, GA4, Google Ads Tag, Meta Pixel**: os locais exatos de inserção estão marcados com comentários `<!-- GTM ... -->` no `<head>` e logo após `<body>` em `index.html` e `obrigado.html`.

---

## 2. Como subir no GitHub e na Vercel

1. Crie um repositório novo no GitHub e suba os arquivos desta pasta (não suba o arquivo `.env`, apenas o `.env.example`).
2. Acesse [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta automaticamente a pasta `api/` e transforma `lead.js` em uma função serverless — não precisa de configuração adicional de build.
4. Configure o domínio personalizado em **Settings → Domains**.

---

## 3. Como configurar as variáveis de ambiente na Vercel

Em **Project Settings → Environment Variables**, adicione:

| Nome | Valor |
|---|---|
| `RESEND_API_KEY` | sua chave de API gerada em [resend.com](https://resend.com) |
| `LEAD_TO_EMAIL` | `davisignalbr@gmail.com` |
| `LEAD_FROM_EMAIL` | `Lead Signal <noreply@seudominio.com.br>` (precisa ser um domínio verificado no Resend) |

Depois de adicionar, faça um novo deploy para que as variáveis entrem em vigor.

> Você pode trocar o Resend por outro serviço de e-mail transacional (ex: Nodemailer + SMTP) editando apenas o arquivo `api/lead.js` — a estrutura do formulário no `index.html` não precisa mudar.

---

## 4. Como testar o formulário

1. Depois do deploy, abra a página publicada e preencha o formulário com dados de teste.
2. Ao enviar, o navegador deve redirecionar para `/obrigado.html`.
3. Confira se o e-mail chegou na caixa de entrada configurada em `LEAD_TO_EMAIL` (verifique também a caixa de spam na primeira vez).
4. Teste também o cenário de erro: derrube a variável `RESEND_API_KEY` temporariamente e confirme que a mensagem de erro amigável aparece no formulário sem travar a página.
5. Teste em um celular real — é de onde deve vir a maior parte do tráfego de anúncios.

---

## 5. Eventos para configurar no Google Tag Manager

A página já dispara os seguintes eventos no `dataLayer` (sem dados pessoais):

- `form_submit` — disparado ao enviar o formulário com sucesso
- `Lead` — disparado junto com `form_submit`, pensado para conversão do Google Ads/Meta Pixel
- `Contact` — disparado ao carregar a página `obrigado.html`
- `click_agendar_reuniao` — clique no botão de agendar no Google Calendar
- `clique_whatsapp` — clique em qualquer botão de WhatsApp

IDs de elementos já preparados para criar triggers por clique no GTM:
`cta-hero-mapa-crescimento`, `cta-mapa-crescimento-secao`, `cta-mapa-meio`,
`cta-video-instagram`, `cta-formulario-mapa`, `cta-final-mapa-crescimento`,
`cta-agendar-reuniao`, `cta-whatsapp-obrigado`, `cta-whatsapp-footer`, `click_instagram`, `clique_whatsapp`.

No GTM, crie:
1. Uma tag de conversão do Google Ads disparada no evento `Lead`
2. Um evento personalizado do Meta Pixel (`Lead`) disparado no mesmo evento
3. Um trigger de "PageView" padrão em todas as páginas (incluindo `obrigado.html`)

---

## 6. Observações de segurança

- Nenhuma chave de API, token ou senha está exposta no HTML ou no JavaScript do front-end — tudo fica nas variáveis de ambiente da Vercel, lido apenas pela função serverless em `api/lead.js`.
- O formulário usa `POST`, nunca `GET` — os dados do lead não aparecem na URL.
- O endpoint `/api/lead` faz validação básica dos campos obrigatórios e sanitiza o conteúdo antes de montar o e-mail (proteção simples contra HTML injection).
- Nenhum dado pessoal (nome, e-mail, telefone) é enviado ao `dataLayer`, ao GA4, ao Google Ads ou ao Meta Pixel — apenas eventos de conversão sem identificação.
- Recomenda-se revisar a Política de Privacidade com um profissional jurídico antes da publicação definitiva, especialmente em relação à LGPD.


---

## Ajustes finais aplicados nesta versão

- Menu mobile corrigido: botão hambúrguer com contraste, área clicável maior e menu com rolagem.
- Botão "Solicitar Mapa" no menu mobile com contraste antes e depois do clique.
- Campos `select` do formulário corrigidos para manter contraste em estados normal/foco/opções.
- Seção antes chamada internamente de "Quebra de objeções" renomeada para "Dúvidas comuns".
- Item "Infoprodutos agressivos com promessas exageradas" ajustado para "Infoprodutos".
- Botão flutuante de WhatsApp removido da página principal. WhatsApp permanece no rodapé e na página de obrigado.
- Formulário mantém `POST` para `/api/lead`, sem chaves/tokens no front-end.
- Nenhum dado pessoal é enviado ao `dataLayer`; apenas eventos de conversão.
- Fontes externas removidas para melhorar performance e reduzir dependências.
