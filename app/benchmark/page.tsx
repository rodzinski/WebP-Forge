"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { runImageBenchmark, type BenchmarkResult } from "@/lib/image-benchmark";

type BenchmarkState = "running" | "complete" | "error";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function BenchmarkPage() {
  const [state, setState] = useState<BenchmarkState>("running");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [error, setError] = useState("");

  async function execute() {
    setState("running"); setProgress(0); setError(""); setResults([]);
    try {
      const benchmark = await runImageBenchmark((completed, total) => setProgress(completed / total * 100));
      setResults(benchmark.results); setState("complete");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao executar o benchmark.");
      setState("error");
    }
  }

  useEffect(() => { void execute(); }, []);

  return (
    <main className="benchmark-shell">
      <header><Link href="/app" className="benchmark-brand"><BrandMark size={38} priority /><span><strong>WebP Forge</strong><small>Laboratório de desempenho</small></span></Link><Link href="/app" className="button ghost">Voltar ao conversor</Link></header>
      <section className="benchmark-hero"><span>BENCHMARK LOCAL</span><h1>Qualidade, memória e velocidade.</h1><p>Uma imagem sintética reproduzível é convertida no seu dispositivo. Nenhum dado é enviado.</p></section>
      <section className="benchmark-card">
        <div className="benchmark-summary"><div><span>RESOLUÇÃO</span><strong>768 × 768</strong></div><div><span>FORMATO</span><strong>WebP</strong></div><div><span>EXECUÇÃO</span><strong>{state === "running" ? "Em andamento" : state === "complete" ? "Concluída" : "Falhou"}</strong></div></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        {state === "error" && <div className="benchmark-error"><strong>Não foi possível executar</strong><span>{error}</span></div>}
        {results.length > 0 && <div className="benchmark-table-wrap"><table className="benchmark-table"><thead><tr><th>Qualidade</th><th>Tempo</th><th>Velocidade</th><th>Tamanho</th><th>Economia</th><th>PSNR</th><th>Memória</th></tr></thead><tbody>{results.map((result) => <tr key={result.quality}><td>{result.quality}%</td><td>{result.durationMs.toFixed(1)} ms</td><td>{result.megapixelsPerSecond.toFixed(2)} MP/s</td><td>{formatBytes(result.outputBytes)}</td><td>{(result.compressionRatio * 100).toFixed(1)}%</td><td>{result.psnr.toFixed(2)} dB</td><td>{result.heapDeltaBytes === null ? "Indisponível" : formatBytes(result.heapDeltaBytes)}</td></tr>)}</tbody></table></div>}
        <footer><p>PSNR maior indica maior fidelidade em relação à referência. A medição de memória depende do navegador.</p><button className="button primary" onClick={execute} disabled={state === "running"}>{state === "running" ? "Executando…" : "Executar novamente"}</button></footer>
      </section>
    </main>
  );
}
