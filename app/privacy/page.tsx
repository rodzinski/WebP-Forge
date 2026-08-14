import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, HardDrive, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Política de Privacidade — WebP Forge",
  description: "Saiba como o WebP Forge trata imagens, preferências e dados locais nas versões web e Windows.",
};

const effectiveDate = "14 de agosto de 2026";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link href="/" className="site-brand" aria-label="WebP Forge — Página inicial">
          <BrandMark size={34} priority />
          <span>WebP Forge</span>
        </Link>
        <Button asChild size="sm" variant="ghost">
          <Link href="/"><ArrowLeft className="size-3.5" />Voltar ao site</Link>
        </Button>
      </header>

      <section className="legal-hero">
        <span className="section-kicker">PRIVACIDADE POR ARQUITETURA</span>
        <h1>Seus arquivos.<br /><em>Sempre sob seu controle.</em></h1>
        <p>
          Esta política explica como o WebP Forge trata informações na versão web e no aplicativo para Windows.
          Em ambos, a conversão de imagens acontece localmente no dispositivo.
        </p>
        <div className="legal-trust-row" aria-label="Resumo de privacidade">
          <span><ShieldCheck aria-hidden="true" />Sem upload de imagens</span>
          <span><HardDrive aria-hidden="true" />Histórico armazenado localmente</span>
        </div>
      </section>

      <div className="legal-layout">
        <aside className="legal-summary">
          <span>EM RESUMO</span>
          <strong>O WebP Forge não precisa receber suas imagens para convertê-las.</strong>
          <p>Não exigimos conta, login ou assinatura para utilizar as funções atuais do produto.</p>
          <small>Em vigor desde {effectiveDate}</small>
        </aside>

        <article className="legal-content">
          <section><span>01</span><div><h2>Quem é o responsável</h2><p>O WebP Forge é desenvolvido e publicado por André Rodzinski. Esta política se aplica ao site, ao conversor executado no navegador e ao aplicativo WebP Forge para Windows.</p></div></section>
          <section><span>02</span><div><h2>Imagens e conversões</h2><p>As imagens escolhidas são lidas e processadas no próprio dispositivo. Elas não são enviadas aos servidores do WebP Forge, não são armazenadas em banco de dados e não são utilizadas para treinamento, publicidade ou criação de perfis.</p><p>Na versão web, o navegador mantém os arquivos em memória somente durante a sessão necessária para a conversão. Recarregar ou fechar a página encerra essa sessão. No Windows, os resultados são gravados apenas na pasta selecionada pelo usuário.</p></div></section>
          <section><span>03</span><div><h2>Dados armazenados localmente</h2><p>Para preservar suas preferências, o WebP Forge pode armazenar no dispositivo:</p><ul><li>configurações de conversão, idioma e tema;</li><li>perfis personalizados;</li><li>histórico resumido dos lotes e informações dos resultados;</li><li>logs locais de erro no aplicativo Windows.</li></ul><p>O histórico não contém uma cópia das imagens. Na versão web, esses dados usam o armazenamento local do navegador e podem ser apagados pelo próprio navegador. O aplicativo Windows oferece a limpeza do histórico e mantém seus arquivos de configuração no perfil local do usuário.</p></div></section>
          <section><span>04</span><div><h2>Site, infraestrutura e terceiros</h2><p>Atualmente não utilizamos contas de usuário, publicidade ou ferramentas próprias de analytics. Como em qualquer site, o provedor de hospedagem e segurança pode processar dados técnicos transitórios — como endereço IP, navegador, data, hora e registros de segurança — para entregar e proteger o serviço.</p><p>O site é hospedado na Cloudflare. Links para downloads e código-fonte podem direcionar ao GitHub. Quando a verificação de atualizações é solicitada manualmente ou ativada nas configurações do aplicativo Windows, o WebP Forge consulta a API pública do GitHub somente para obter os dados da versão mais recente. Imagens, histórico e configurações não são enviados nessa consulta. Ao acessar esses serviços, aplicam-se também as políticas de privacidade dos respectivos provedores.</p></div></section>
          <section><span>05</span><div><h2>Metadados das imagens</h2><p>Dependendo das configurações e do formato escolhido, a conversão pode preservar, remover ou limitar metadados incorporados, incluindo EXIF. O resultado exibido e salvo respeita a opção selecionada pelo usuário. Nenhum metadado é enviado ao WebP Forge.</p></div></section>
          <section><span>06</span><div><h2>Controle e direitos do usuário</h2><p>Você pode limpar o histórico pelo produto, remover dados locais nas configurações do navegador, excluir arquivos gerados e desinstalar o aplicativo a qualquer momento. Como não mantemos contas nem um banco de dados de imagens, normalmente não possuímos imagens ou histórico remoto para localizar ou excluir.</p></div></section>
          <section><span>07</span><div><h2>Alterações e contato</h2><p>Esta política poderá ser atualizada quando o produto ou seus serviços mudarem. A data de vigência será atualizada nesta página. Dúvidas de privacidade e solicitações podem ser enviadas pelo canal público de suporte do projeto.</p><Button asChild variant="outline" size="sm"><a href="https://github.com/rodzinski/WebP-Forge/issues" target="_blank" rel="noreferrer">Abrir canal de suporte <ExternalLink className="size-3.5" /></a></Button></div></section>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
