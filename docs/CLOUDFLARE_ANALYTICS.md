# Cloudflare Web Analytics com consentimento

O site carrega o beacon da Cloudflare somente depois que o visitante escolhe **Permitir métricas**. Sem consentimento, nenhuma requisição ao beacon é realizada.

## Configuração no Cloudflare

1. Abra **Analytics & Logs → Web Analytics** no painel da Cloudflare.
2. Adicione o domínio do WebP Forge e copie o token público do site.
3. O token público do WebP Forge já está configurado no componente de consentimento.
4. Se o site do Analytics for substituído, configure `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` no build para sobrescrever o token padrão e faça um novo deploy.
5. Não ative uma segunda injeção automática do beacon, pois ela ignoraria a camada de consentimento criada pelo site.

O token identifica o site no Web Analytics e não deve ser tratado como credencial administrativa. Tokens de API da conta Cloudflare continuam sendo secretos e nunca devem usar essa variável.

## Comportamento

- Desativado por padrão.
- Escolha armazenada somente no `localStorage` do navegador.
- Sem eventos contendo imagens, nomes de arquivos, formatos escolhidos ou histórico.
- Revogação disponível no rodapé.
- A variável de build é opcional e permite substituir o token público configurado no projeto.
