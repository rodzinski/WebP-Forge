"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export type ConversionReportEntry = {
  id: string;
  name: string;
  status: "Concluído" | "Erro" | "Cancelado";
  sourceSize: number;
  outputSize?: number;
  error?: string;
  durationMs: number;
};

type ConversionReportPanelProps = {
  entries: ConversionReportEntry[];
  onClose: () => void;
  onRetryFailures: () => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function savings(entry: ConversionReportEntry) {
  if (entry.outputSize === undefined || !entry.sourceSize) return "—";
  return `${((1 - entry.outputSize / entry.sourceSize) * 100).toFixed(1)}%`;
}

function reportText(entries: ConversionReportEntry[]) {
  const heading = "Arquivo\tResultado\tOriginal\tFinal\tEconomia\tTempo\tDetalhes";
  return [heading, ...entries.map((entry) => [
    entry.name, entry.status, formatBytes(entry.sourceSize),
    entry.outputSize === undefined ? "—" : formatBytes(entry.outputSize), savings(entry),
    `${(entry.durationMs / 1000).toFixed(2)}s`, entry.error ?? "Conversão concluída",
  ].join("\t"))].join("\n");
}

export function ConversionReportPanel({ entries, onClose, onRetryFailures }: ConversionReportPanelProps) {
  const [copied, setCopied] = useState(false);
  const successes = entries.filter((entry) => entry.status === "Concluído").length;
  const failures = entries.filter((entry) => entry.status === "Erro").length;
  const cancelled = entries.filter((entry) => entry.status === "Cancelado").length;
  const outputSize = entries.reduce((sum, entry) => sum + (entry.outputSize ?? 0), 0);

  async function copyReport() {
    await navigator.clipboard.writeText(reportText(entries));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={onClose}>
      <motion.section className="report-panel" role="dialog" aria-modal="true" aria-labelledby="report-title"
        initial={{ opacity: 0, scale: .98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .2 }}
        onMouseDown={(event) => event.stopPropagation()}>
        <header className="report-header">
          <div><span>RELATÓRIO DO LOTE</span><h2 id="report-title">Conversão concluída</h2><p>Confira cada arquivo e repita somente o que falhou.</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar relatório">×</button>
        </header>
        <div className="report-metrics">
          <div><span>TOTAL</span><strong>{entries.length}</strong></div>
          <div><span>SUCESSOS</span><strong>{successes}</strong></div>
          <div><span>FALHAS</span><strong>{failures}</strong></div>
          <div><span>CANCELADOS</span><strong>{cancelled}</strong></div>
          <div><span>TAMANHO FINAL</span><strong>{formatBytes(outputSize)}</strong></div>
        </div>
        <div className="report-table-wrap">
          <table className="report-table">
            <thead><tr><th>Arquivo</th><th>Resultado</th><th>Original</th><th>Final</th><th>Economia</th><th>Tempo</th><th>Detalhes</th></tr></thead>
            <tbody>{entries.map((entry) => <tr key={entry.id}>
              <td title={entry.name}>{entry.name}</td><td><span className={`status status-${entry.status.toLowerCase().replace("í", "i")}`}>{entry.status}</span></td>
              <td>{formatBytes(entry.sourceSize)}</td><td>{entry.outputSize === undefined ? "—" : formatBytes(entry.outputSize)}</td>
              <td>{savings(entry)}</td><td>{(entry.durationMs / 1000).toFixed(2)}s</td><td title={entry.error}>{entry.error ?? "Conversão concluída"}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <footer className="report-actions">
          <button className="button ghost" onClick={copyReport}>{copied ? "Relatório copiado" : "Copiar relatório"}</button>
          <button className="button primary" onClick={onRetryFailures} disabled={!failures}>Tentar novamente somente as falhas</button>
        </footer>
      </motion.section>
    </motion.div>
  );
}
