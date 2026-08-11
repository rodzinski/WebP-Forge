"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ConversionReportEntry } from "@/components/app/conversion-report-panel";
import { translate, type AppLocale } from "@/lib/i18n";

export type ConversionHistoryEntry = {
  id: string;
  createdAt: string;
  width: number;
  height: number;
  quality: number;
  outputFormat: string;
  items: ConversionReportEntry[];
};

type HistoryPanelProps = {
  entries: ConversionHistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  locale: AppLocale;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function HistoryPanel({ entries, onClear, onClose, locale }: HistoryPanelProps) {
  const tr = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const statusText = (status: ConversionReportEntry["status"]) => status === "Concluído" ? tr("completed") : status === "Erro" ? tr("error") : tr("cancelled");
  const [selectedId, setSelectedId] = useState(entries[0]?.id ?? "");
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={onClose}>
      <motion.section className="history-panel" role="dialog" aria-modal="true" aria-labelledby="history-title"
        initial={{ opacity: 0, scale: .98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .2 }}
        onMouseDown={(event) => event.stopPropagation()}>
        <header className="report-header">
          <div><span>{tr("localHistory")}</span><h2 id="history-title">{tr("recent")}</h2><p>Até 50 lotes salvos somente neste navegador.</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar histórico">×</button>
        </header>
        {!entries.length ? <div className="history-empty"><strong>{tr("noHistory")}</strong><span>Os próximos lotes aparecerão aqui.</span></div> :
          <div className="history-layout">
            <div className="history-list">{entries.map((entry) => {
              const successes = entry.items.filter((item) => item.status === "Concluído").length;
              const failures = entry.items.filter((item) => item.status === "Erro").length;
              return <button key={entry.id} className={entry.id === selected?.id ? "selected" : ""} onClick={() => setSelectedId(entry.id)}>
                <span>{new Date(entry.createdAt).toLocaleString(locale === "pt" ? "pt-BR" : locale, { dateStyle: "short", timeStyle: "short" })}</span>
                <strong>{entry.width} × {entry.height} · {entry.outputFormat.toUpperCase()} · {entry.quality}%</strong>
                <small>{successes} sucesso(s) · {failures} falha(s)</small>
              </button>;
            })}</div>
            <div className="history-detail">
              <div className="history-detail-summary"><strong>Detalhes do lote</strong><span>{selected?.items.length ?? 0} arquivo(s)</span></div>
              <div className="history-items">{selected?.items.map((item) => <div key={item.id}>
                <span title={item.name}>{item.name}</span><b className={`status status-${item.status.toLowerCase().replace("í", "i")}`}>{statusText(item.status)}</b>
                <small>{formatBytes(item.sourceSize)} → {item.outputSize === undefined ? "—" : formatBytes(item.outputSize)}{item.error ? ` · ${item.error}` : ""}</small>
              </div>)}</div>
            </div>
          </div>}
        <footer className="history-footer"><span>O histórico não contém as imagens e nunca é enviado.</span><button className="button ghost" onClick={onClear} disabled={!entries.length}>{tr("clearHistory")}</button></footer>
      </motion.section>
    </motion.div>
  );
}
