"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, MessageSquareText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";

const categories = [
  { value: "enhancement", label: "Sugestão" },
  { value: "bug", label: "Problema" },
  { value: "design", label: "Experiência visual" },
  { value: "feedback", label: "Outro" },
] as const;

export function FeedbackForm() {
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("enhancement");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [includeBrowser, setIncludeBrowser] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const valid = title.trim().length > 0 && message.trim().length > 0;

  function openFeedback() {
    setAttempted(true);
    if (!valid) return;

    let body = message.trim();
    if (includeBrowser) body += `\n\n---\nNavegador: ${navigator.userAgent}\nPágina: ${window.location.origin}`;
    const query = new URLSearchParams({ title: `[${category}] ${title.trim()}`, body });
    window.open(`https://github.com/rodzinski/WebP-Forge/issues/new?${query}`, "_blank", "noopener,noreferrer");
  }

  return <div className="feedback-layout">
    <aside className="feedback-assurance">
      <span><ShieldCheck className="size-4" /> PRIVACIDADE PRIMEIRO</span>
      <h2>Você controla o que será compartilhado.</h2>
      <p>Não enviamos sua mensagem automaticamente. O relato será aberto no GitHub para você revisar e publicar.</p>
      <ul>
        <li><CheckCircle2 className="size-4" /> Nenhuma imagem é anexada</li>
        <li><CheckCircle2 className="size-4" /> Sem telemetria de conversão</li>
        <li><CheckCircle2 className="size-4" /> Conversa pública e transparente</li>
      </ul>
    </aside>

    <section className="feedback-form" aria-labelledby="feedback-form-title">
      <header><MessageSquareText className="size-5" /><div><span>CANAL DE FEEDBACK</span><h2 id="feedback-form-title">Conte o que podemos melhorar.</h2></div></header>
      <SelectField label="Tipo de feedback" options={categories} value={category} onChange={setCategory} />
      <label>Título<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="Resuma sua ideia ou problema" /></label>
      <label>Mensagem<textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={4000} placeholder="Conte o que aconteceu ou como podemos melhorar…" /></label>
      <label className="feedback-checkbox"><input type="checkbox" checked={includeBrowser} onChange={(event) => setIncludeBrowser(event.target.checked)} /><span>Incluir navegador e endereço do site</span></label>
      {attempted && !valid && <p className="feedback-error" role="alert">Preencha o título e a mensagem.</p>}
      <Button type="button" variant="accent" size="lg" onClick={openFeedback}>Revisar no GitHub <ArrowUpRight className="size-4" /></Button>
    </section>
  </div>;
}
