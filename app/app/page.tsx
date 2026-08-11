"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { downloadZip } from "client-zip";
import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";
import { SettingsPanel } from "@/components/app/settings-panel";
import { ComparisonPanel } from "@/components/app/comparison-panel";
import { ConversionReportPanel, type ConversionReportEntry } from "@/components/app/conversion-report-panel";
import { HistoryPanel, type ConversionHistoryEntry } from "@/components/app/history-panel";
import { defaultSettings, type ConversionSettings } from "@/lib/conversion-settings";
import { encodeCanvas, outputName } from "@/lib/image-output";

type ItemStatus = "Pronto" | "Convertendo" | "Concluído" | "Erro" | "Cancelado";

type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  status: ItemStatus;
  error?: string;
  output?: Blob;
  outputFormat?: ConversionSettings["outputFormat"];
  frameCount: number;
};

const supportedExtensions = new Set(["png", "jpg", "jpeg", "jfif", "webp", "avif", "gif", "bmp"]);

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function extensionOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

async function loadDimensions(file: File) {
  const bitmap = await createImageBitmap(file);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

async function detectFrameCount(file: File) {
  const extension = extensionOf(file.name);
  if (extension !== "gif" && extension !== "webp") return 1;
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (extension === "gif") return Math.max(1, bytes.reduce((count, byte) => count + (byte === 0x2c ? 1 : 0), 0));
  let frames = 0;
  for (let index = 0; index <= bytes.length - 4; index += 1)
    if (bytes[index] === 0x41 && bytes[index + 1] === 0x4e && bytes[index + 2] === 0x4d && bytes[index + 3] === 0x46) frames += 1;
  return Math.max(1, frames);
}

async function convertImage(file: File, settings: ConversionSettings) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = settings.width;
  canvas.height = settings.height;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Canvas indisponível neste navegador.");

  if (settings.outputFormat === "jpg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, settings.width, settings.height);
  } else {
    context.clearRect(0, 0, settings.width, settings.height);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  const scale = settings.fitMode === "crop"
    ? Math.max(settings.width / bitmap.width, settings.height / bitmap.height)
    : Math.min(settings.width / bitmap.width, settings.height / bitmap.height);
  const drawWidth = settings.fitMode === "stretch" ? settings.width : Math.max(1, Math.round(bitmap.width * scale));
  const drawHeight = settings.fitMode === "stretch" ? settings.height : Math.max(1, Math.round(bitmap.height * scale));
  const x = Math.round((settings.width - drawWidth) / 2);
  const y = Math.round((settings.height - drawHeight) / 2);
  context.drawImage(bitmap, x, y, drawWidth, drawHeight);
  bitmap.close();

  return encodeCanvas(canvas, settings);
}

export default function WebPForge() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>(defaultSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [comparisonId, setComparisonId] = useState<string | null>(null);
  const [report, setReport] = useState<ConversionReportEntry[] | null>(null);
  const [history, setHistory] = useState<ConversionHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState("Adicione imagens para começar");
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ImageItem[]>([]);
  const cancelledIds = useRef(new Set<string>());

  useEffect(() => {
    const saved = localStorage.getItem("webp-forge-settings");
    if (saved) {
      try { setSettings({ ...defaultSettings, ...JSON.parse(saved) }); } catch { /* preferência inválida */ }
    }
    try { setHistory(JSON.parse(localStorage.getItem("webp-forge-history") ?? "[]")); } catch { setHistory([]); }
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    localStorage.setItem("webp-forge-settings", JSON.stringify(settings));
    document.documentElement.dataset.theme = settings.theme;
  }, [settings, settingsLoaded]);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => () => { itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl)); }, []);

  const completed = items.filter((item) => item.status === "Concluído").length;
  const failed = items.filter((item) => item.status === "Erro").length;
  const cancelled = items.filter((item) => item.status === "Cancelado").length;
  const progress = items.length ? ((completed + failed + cancelled) / items.length) * 100 : 0;
  const totalSize = useMemo(() => items.reduce((sum, item) => sum + item.file.size, 0), [items]);
  const outputTotal = useMemo(() => items.reduce((sum, item) => sum + (item.output?.size ?? 0), 0), [items]);
  const comparedItem = comparisonId ? items.find((item) => item.id === comparisonId && item.output) : undefined;

  async function addFiles(files: FileList | File[]) {
    const known = new Set(items.map((item) => `${item.file.name}:${item.file.size}:${item.file.lastModified}`));
    const incoming = Array.from(files).filter((file) => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      return supportedExtensions.has(extensionOf(file.name)) && !known.has(key);
    });
    if (!incoming.length) {
      setMessage("Nenhuma imagem compatível nova foi encontrada");
      return;
    }

    setMessage(`Lendo ${incoming.length} imagem(ns)…`);
    const loaded = await Promise.all(incoming.map(async (file) => {
      try {
        const [dimensions, frameCount] = await Promise.all([loadDimensions(file), detectFrameCount(file)]);
        return {
          id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file),
          ...dimensions, frameCount, status: "Pronto" as ItemStatus,
        };
      } catch {
        return null;
      }
    }));
    const valid = loaded.filter((item): item is ImageItem => item !== null);
    setItems((current) => [...current, ...valid]);
    const animated = valid.filter((item) => item.frameCount > 1).length;
    setMessage(`${valid.length} imagem(ns) adicionada(s)${animated ? ` · ${animated} animação(ões) usarão o primeiro quadro` : ""}`);
  }

  function clearAll() {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setComparisonId(null);
    setMessage("Lista limpa");
  }

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  function moveItem(id: string, offset: number) {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function cancelItem(id: string) {
    cancelledIds.current.add(id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: "Cancelado" } : item));
  }

  async function convertItems(targets: ImageItem[]) {
    if (!targets.length || isConverting) return;
    setIsConverting(true);
    targets.forEach((item) => cancelledIds.current.delete(item.id));
    setReport(null);
    setMessage("Preparando conversão…");
    let success = 0;
    const entries: ConversionReportEntry[] = [];

    for (const item of targets) {
      const startedAt = performance.now();
      if (cancelledIds.current.has(item.id)) {
        entries.push({ id: item.id, name: item.file.name, status: "Cancelado", sourceSize: item.file.size, durationMs: 0 });
        continue;
      }
      setItems((current) => current.map((entry) => entry.id === item.id
        ? { ...entry, status: "Convertendo", error: undefined, output: undefined, outputFormat: undefined } : entry));
      try {
        const output = await convertImage(item.file, settings);
        if (cancelledIds.current.has(item.id)) {
          entries.push({ id: item.id, name: item.file.name, status: "Cancelado", sourceSize: item.file.size, durationMs: performance.now() - startedAt });
          continue;
        }
        success += 1;
        setItems((current) => current.map((entry) => entry.id === item.id
          ? { ...entry, output, outputFormat: settings.outputFormat, status: "Concluído" } : entry));
        entries.push({ id: item.id, name: item.file.name, status: "Concluído", sourceSize: item.file.size, outputSize: output.size, durationMs: performance.now() - startedAt });
        setMessage(`Convertendo ${entries.length} de ${targets.length}`);
      } catch (error) {
        const detail = error instanceof Error ? error.message : "Falha ao converter";
        setItems((current) => current.map((entry) => entry.id === item.id
          ? { ...entry, status: "Erro", error: detail } : entry));
        entries.push({ id: item.id, name: item.file.name, status: "Erro", sourceSize: item.file.size, error: detail, durationMs: performance.now() - startedAt });
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    setIsConverting(false);
    setReport(entries);
    const historyEntry: ConversionHistoryEntry = {
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), width: settings.width,
      height: settings.height, quality: settings.quality, outputFormat: settings.outputFormat, items: entries,
    };
    setHistory((current) => {
      const next = [historyEntry, ...current].slice(0, 50);
      localStorage.setItem("webp-forge-history", JSON.stringify(next));
      return next;
    });
    setMessage(`${success} de ${targets.length} imagem(ns) convertida(s)`);
  }

  function convertAll() {
    void convertItems(items);
  }

  function retryFailures() {
    const failedIds = new Set(report?.filter((entry) => entry.status === "Erro").map((entry) => entry.id));
    const failedItems = items.filter((item) => failedIds.has(item.id));
    void convertItems(failedItems);
  }

  function clearHistory() {
    if (!window.confirm("Deseja apagar todo o histórico local?")) return;
    localStorage.removeItem("webp-forge-history");
    setHistory([]);
  }

  async function downloadAll() {
    const converted = items.filter((item) => item.output);
    if (!converted.length) return;
    const names = new Map<string, number>();
    const files = converted.map((item) => {
      const format = item.outputFormat ?? settings.outputFormat;
      const original = outputName(item.file.name, format);
      const count = names.get(original) ?? 0;
      names.set(original, count + 1);
      const extension = `.${format}`;
      const name = count ? original.replace(extension, `-${count + 1}${extension}`) : original;
      return { name, input: item.output! };
    });
    const blob = await downloadZip(files).blob();
    triggerDownload(blob, "webp-forge.zip");
  }

  function triggerDownload(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addFiles(event.dataTransfer.files);
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) void addFiles(event.target.files);
    event.target.value = "";
  }

  return (
    <main className="app-shell" onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
      onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }} onDrop={handleDrop}>
      <header className="topbar">
        <div className="brand">
          <BrandMark size={40} priority />
          <div><strong>WebP Forge</strong><span>Conversor de imagens</span></div>
        </div>
        <div className="privacy-pill"><span>●</span> Processamento local e privado</div>
        <button className="icon-button" onClick={() => setShowHistory(true)} aria-label="Abrir histórico" title="Histórico">◷</button>
        <button className="icon-button" onClick={() => setShowSettings(true)} aria-label="Abrir configurações" title="Configurações">⚙</button>
      </header>

      <section className="workspace">
        <div className="intro-row">
          <div>
            <p className="eyebrow">CONVERSÃO EM LOTE</p>
            <h1>Imagens perfeitas.<br /><em>Prontas para a web.</em></h1>
            <p className="intro-copy">Converta várias imagens para WebP, AVIF, PNG, JPG ou ICO com tamanho uniforme e alta qualidade.</p>
          </div>
          <div className="actions">
            <button className="button secondary" onClick={() => fileInput.current?.click()}>＋ Adicionar imagens</button>
            <button className="button ghost" onClick={() => folderInput.current?.click()}>▣ Adicionar pasta</button>
            <input ref={fileInput} type="file" accept=".png,.jpg,.jpeg,.jfif,.webp,.avif,.gif,.bmp" multiple hidden onChange={handleInput} />
            <input ref={(node) => { folderInput.current = node; node?.setAttribute("webkitdirectory", ""); }} type="file" multiple hidden onChange={handleInput} />
          </div>
        </div>

        <section className={`drop-card ${isDragging ? "dragging" : ""} ${items.length ? "has-files" : ""}`}>
          {!items.length ? (
            <button className="empty-state" onClick={() => fileInput.current?.click()}>
              <span className="drop-icon">⇩</span>
              <strong>Solte suas imagens aqui</strong>
              <span>ou clique para selecionar arquivos</span>
              <small>PNG, JPG, JPEG, JFIF, WebP, AVIF, GIF e BMP</small>
            </button>
          ) : (
            <>
              <div className="list-toolbar">
                <div><strong>{items.length} imagem(ns)</strong><span>{formatBytes(totalSize)} no total</span></div>
                <button className="text-button" onClick={clearAll} disabled={isConverting}>Limpar lista</button>
              </div>
              <div className="image-list">
                {items.map((item) => (
                  <article className="image-row" key={item.id}>
                    <Image src={item.previewUrl} alt="" width={48} height={48} unoptimized />
                    <div className="file-info"><strong title={item.file.name}>{item.file.name}</strong><span>{item.width} × {item.height} · {formatBytes(item.file.size)}{item.frameCount > 1 && ` · ${item.frameCount} quadros · saída pelo 1º quadro`}</span></div>
                    <span className={`status status-${item.status.toLowerCase().replace("í", "i")}`} title={item.error}>{item.status}</span>
                    <div className="row-actions">
                      {!isConverting && <><button className="row-button" onClick={() => moveItem(item.id, -1)} aria-label={`Mover ${item.file.name} para cima`}>↑</button><button className="row-button" onClick={() => moveItem(item.id, 1)} aria-label={`Mover ${item.file.name} para baixo`}>↓</button></>}
                      {isConverting && item.status !== "Concluído" && item.status !== "Cancelado" && <button className="row-button cancel" onClick={() => cancelItem(item.id)} aria-label={`Cancelar ${item.file.name}`}>×</button>}
                      {item.output ? <><button className="row-button compare" onClick={() => setComparisonId(item.id)} aria-label={`Comparar ${item.file.name}`}>◐</button><button className="row-button" onClick={() => triggerDownload(item.output!, outputName(item.file.name, item.outputFormat ?? settings.outputFormat))} aria-label={`Baixar ${item.file.name}`}>⇩</button></>
                        : !isConverting && <button className="row-button remove" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.file.name}`}>×</button>}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="conversion-bar">
          <div className="preset-summary"><span>SAÍDA</span><strong>{settings.width} × {settings.height}px</strong><i></i><strong>{settings.fitMode === "contain" ? "Conter" : settings.fitMode === "crop" ? "Recortar" : "Esticar"}</strong><i></i><strong>{settings.outputFormat.toUpperCase()} · {settings.quality}%</strong></div>
          <div className="progress-copy"><span>{message}{outputTotal > 0 && ` · ${formatBytes(totalSize)} → ${formatBytes(outputTotal)}`}</span>{items.length > 0 && <small>{Math.round(progress)}%</small>}</div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <div className="conversion-actions">
            {completed > 0 && !isConverting && <button className="button secondary" onClick={downloadAll}>↓ Baixar ZIP</button>}
            <button className="button primary" onClick={convertAll} disabled={!items.length || isConverting}>
              {isConverting ? "Convertendo…" : `Converter para ${settings.outputFormat.toUpperCase()}`}
            </button>
          </div>
        </section>
      </section>

      <footer><span>WebP Forge Web</span><span>Seus arquivos nunca saem deste dispositivo.</span></footer>

      {showSettings && <SettingsPanel settings={settings} onChange={setSettings} onClose={() => setShowSettings(false)} />}
      {comparedItem?.output && <ComparisonPanel name={comparedItem.file.name} originalUrl={comparedItem.previewUrl}
        originalSize={comparedItem.file.size} output={comparedItem.output}
        outputFormat={comparedItem.outputFormat ?? settings.outputFormat} onClose={() => setComparisonId(null)} />}
      {report && <ConversionReportPanel entries={report} onClose={() => setReport(null)} onRetryFailures={retryFailures} />}
      {showHistory && <HistoryPanel entries={history} onClear={clearHistory} onClose={() => setShowHistory(false)} />}
    </main>
  );
}
