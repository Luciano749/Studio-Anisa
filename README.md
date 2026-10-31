# Studio Anisa

Landing page estática em HTML, CSS e JavaScript. Os arquivos para hospedagem estão em `dist/`:

- `index.html`: conteúdo, formulário, SEO e política CSP.
- `styles.css`: identidade visual, responsividade e animações.
- `script.js`: navegação, validação e preparação do pedido no WhatsApp.

## Abrir e editar

Abra `dist/index.html` no navegador ou sirva `dist/` por HTTP, por exemplo `python -m http.server 8080 --directory dist`. Para publicar, envie o conteúdo de `dist/` a uma hospedagem estática com HTTPS. Não é necessário Node, npm ou compilação.

Layout e ícones usam CSS Grid e SVG nativos. Manrope, usada nos botões, vem do Google Fonts com font-display: swap. As animações usam CSS e IntersectionObserver nativo e respeitam movimento reduzido.

Documentação: https://getbootstrap.com/docs/5.3/ e https://developers.google.com/fonts/docs/material_symbols

## Formulário

O destino está fixado em `script.js`: `5534998724407`, conforme número fornecido. Contato atualizado conforme confirmação do proprietário nesta sessão: (34) 99872-4407.

Nome, telefone brasileiro com DDD, serviço e data são validados no navegador. Alterar os campos invalida a mensagem anterior. O resultado usa textContent e encodeURIComponent; dados não são inseridos como HTML. O botão prepara a mensagem, e a visitante revisa e abre o WhatsApp para enviar. Não há banco de dados, API, cookies de rastreamento ou armazenamento local. O Studio confirma o horário por mensagem.

## Segurança e hospedagem

Há CSP por meta tag, Referrer Policy, SRI no CSS Bootstrap e noopener/noreferrer nos links externos. O script temporário do Figma foi removido. A CSP bloqueia envio de formulários e limita conexões à própria origem: a aplicação só prepara um link de navegação para o WhatsApp. A hospedagem Sites pode acrescentar recursos próprios; qualquer mudança na CSP deve considerar o que o ambiente realmente exige.

Validação do navegador melhora a experiência, mas pode ser burlada; se adicionar servidor, valide os dados novamente e aplique proteção contra abuso e limites de requisições nele. Não há mecanismo antispam de servidor neste projeto.

Configure na hospedagem HTTPS e cabeçalhos de resposta como `X-Content-Type-Options: nosniff` e uma CSP com `frame-ancestors` adequada aos domínios que precisam incorporar a página. `frame-ancestors` não funciona por meta tag. HSTS é configuração de produção do domínio; avalie antes de ativar. O arquivo estático não configura esses cabeçalhos automaticamente.

## Personalização

Edite textos e serviços no HTML, cores em `:root` no CSS e o destino WhatsApp no JavaScript. O endereço e as informações devem ser validados pelo Studio antes de divulgação. A ilustração é editorial, não uma fotografia do salão.

## SEO e publicação na Vercel

O domínio canônico atual é https://studio-anisa.vercel.app/. robots.txt e sitemap.xml apontam para ele. Ao migrar para domínio próprio, atualizar canonical, sitemap, robots, metadados sociais e URLs dos dados estruturados juntos. O JSON-LD possui hash na CSP: ao editar o bloco, recalcular o SHA-256 do seu conteúdo exato.

Publicar todo o conteúdo de dist/, incluindo vercel.json, robots.txt, sitemap.xml e imagens sociais. Atualizar lastmod somente quando houver alteração real. Não publicar tokens ou arquivos .env.

