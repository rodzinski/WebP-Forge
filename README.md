# WebP Forge Web

Versão pública do WebP Forge, construída com React 19, Next.js App Router, TypeScript e Tailwind CSS para execução no Cloudflare Workers.

A conversão acontece integralmente no navegador. As imagens não são enviadas, armazenadas ou processadas no servidor.

## Recursos

- Conversão em lote para WebP.
- Suporte a PNG, JPG, JPEG, JFIF, WebP, GIF e BMP.
- Redimensionamento proporcional, centralização e bordas transparentes.
- Dimensões e qualidade configuráveis.
- Download individual ou do lote em ZIP.
- Temas claro, escuro e automático.
- Interface responsiva e instalável como aplicativo web.
- Acesso público, sem login.

## Requisitos

- Node.js 22.13 ou mais recente.
- Conta gratuita ou paga no Cloudflare.
- Repositório no GitHub para publicação automática.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal.

## Validação

```bash
npm run lint
npm run build
npm run deploy:dry
```

## Publicação manual

Na primeira vez, autentique o Wrangler e publique:

```bash
npx wrangler login
npm run deploy
```

O Cloudflare criará um endereço público `*.workers.dev`.

## Publicação automática pelo GitHub

1. Envie esta pasta para um repositório no GitHub.
2. No painel do Cloudflare, abra **Workers & Pages** e importe o repositório.
3. Selecione a branch `main` como produção.
4. Configure o comando de build como `npm run build`.
5. Configure o comando de deploy como `npx wrangler deploy --config dist/server/wrangler.json`.
6. Salve e execute o primeiro deploy.

Cada novo push para `main` atualizará o site automaticamente. Branches e pull requests podem receber URLs temporárias de preview.

## Domínio personalizado

Após publicar, abra o Worker no Cloudflare e use **Settings > Domains & Routes > Add > Custom Domain**. O endereço `*.workers.dev` permanece disponível mesmo sem domínio próprio.

## Estrutura

- `app/`: rotas, layout e estilos globais.
- `components/`: componentes visuais e seções da homepage.
- `lib/`: regras de conversão e utilitários compartilhados.
- `public/`: ícones, manifesto e imagens públicas.
- `worker/`: ponto de entrada compatível com Cloudflare Workers.
- `tests/`: verificações automatizadas.

## Privacidade

Não há autenticação do ChatGPT nem integração com o ambiente privado do ChatGPT Sites neste projeto. O processamento de arquivos utiliza APIs do navegador e permanece no dispositivo do visitante.
