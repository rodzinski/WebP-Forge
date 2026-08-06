"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { downloadZip } from "client-zip";
import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";

type ItemStatus = "Pronto" | "Convertendo" | "Concluído" | "Erro";

type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  status: ItemStatus;
  error?: string;
  output?: Blob;
};

type Settings = {
  width: number;
  height: number;
  quality: number;
  theme: "system" | "light" | "dark";
};

const supportedExtensions = new Set(["png", "jpg", "jpeg", "jfif", "webp", "avif", "gif", "bmp"]);
const defaultSettings: Settings = { width: 128, height: 128, quality: 95, theme: "system" };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function extensionOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function outputName(name: string) {
  return `${name.replace(/\.[^.]+$/, "")}.webp`;
}

async function loadDimensions(file: File) {
  const bitmap = await createImageBitmap(file);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

async function convertImage(file: File, settings: Settings) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = settings.width;
  canvas.height = settings.height;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Canvas indisponível neste navegador.");

  context.clearRect(0, 0, settings.width, settings.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  const scale = Math.min(settings.width / bitmap.width, settings.height / bitmap.height);
  const drawWidth = Math.max(1, Math.round(bitmap.width * scale));
  const drawHeight = Math.max(1, Math.round(bitmap.height * scale));
  const x = Math.round((settings.width - drawWidth) / 2);
  const y = Math.round((settings.height - drawHeight) / 2);
  context.drawImage(bitmap, x, y, drawWidth, drawHeight);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", settings.quality / 100),
  );
  if (!blob || blob.type !== "image/webp") {
    throw new Error("Seu navegador não conseguiu gerar WebP.");
  }
  return blob;
}

export default function WebPForge() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("Adicione imagens para começar");
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("webp-forge-settings");
    if (saved) {
      try { setSettings({ ...defaultSettings, ...JSON.parse(saved) }); } catch { /* preferência inválida */ }
    }
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
  const progress = items.length ? ((completed + failed) / items.length) * 100 : 0;
  const totalSize = useMemo(() => items.reduce((sum, item) => sum + item.file.size, 0), [items]);

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
        const dimensions = await loadDimensions(file);
        return {
          id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file),
          ...dimensions, status: "Pronto" as ItemStatus,
        };
      } catch {
        return null;
      }
    }));
    const valid = loaded.filter((item): item is ImageItem => item !== null);
    setItems((current) => [...current, ...valid]);
    setMessage(`${valid.length} imagem(ns) adicionada(s)`);
  }

  function clearAll() {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setMessage("Lista limpa");
  }

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  async function convertAll() {
    if (!items.length || isConverting) return;
    setIsConverting(true);
    setMessage("Preparando conversão…");
    let success = 0;

    for (const item of items) {
      setItems((current) => current.map((entry) => entry.id === item.id
        ? { ...entry, status: "Convertendo", error: undefined } : entry));
      try {
        const output = await convertImage(item.file, settings);
        success += 1;
        setItems((current) => current.map((entry) => entry.id === item.id
          ? { ...entry, output, status: "Concluído" } : entry));
        setMessage(`Convertendo ${success} de ${items.length}`);
      } catch (error) {
        setItems((current) => current.map((entry) => entry.id === item.id
          ? { ...entry, status: "Erro", error: error instanceof Error ? error.message : "Falha ao converter" } : entry));
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    setIsConverting(false);
    setMessage(`${success} de ${items.length} imagem(ns) convertida(s)`);
  }

  async function downloadAll() {
    const converted = items.filter((item) => item.output);
    if (!converted.length) return;
    const names = new Map<string, number>();
    const files = converted.map((item) => {
      const original = outputName(item.file.name);
      const count = names.get(original) ?? 0;
      names.set(original, count + 1);
      const name = count ? original.replace(/\.webp$/, `-${count + 1}.webp`) : original;
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
        <button className="icon-button" onClick={() => setShowSettings(true)} aria-label="Abrir configurações" title="Configurações">⚙</button>
      </header>

      <section className="workspace">
        <div className="intro-row">
          <div>
            <p className="eyebrow">CONVERSÃO EM LOTE</p>
            <h1>Imagens perfeitas.<br /><em>Prontas para a web.</em></h1>
            <p className="intro-copy">Converta várias imagens para WebP com tamanho uniforme, alta qualidade e transparência preservada.</p>
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
                    <div className="file-info"><strong title={item.file.name}>{item.file.name}</strong><span>{item.width} × {item.height} · {formatBytes(item.file.size)}</span></div>
                    <span className={`status status-${item.status.toLowerCase().replace("í", "i")}`} title={item.error}>{item.status}</span>
                    {item.output ? <button className="row-button" onClick={() => triggerDownload(item.output!, outputName(item.file.name))} aria-label={`Baixar ${item.file.name}`}>↓</button>
                      : <button className="row-button remove" onClick={() => removeItem(item.id)} disabled={isConverting} aria-label={`Remover ${item.file.name}`}>×</button>}
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="conversion-bar">
          <div className="preset-summary"><span>SAÍDA</span><strong>{settings.width} × {settings.height}px</strong><i></i><strong>WebP · {settings.quality}%</strong></div>
          <div className="progress-copy"><span>{message}</span>{items.length > 0 && <small>{Math.round(progress)}%</small>}</div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <div className="conversion-actions">
            {completed > 0 && !isConverting && <button className="button secondary" onClick={downloadAll}>↓ Baixar ZIP</button>}
            <button className="button primary" onClick={convertAll} disabled={!items.length || isConverting}>
              {isConverting ? "Convertendo…" : "Converter para WebP"}
            </button>
          </div>
        </section>
      </section>

      <footer><span>WebP Forge Web</span><span>Seus arquivos nunca saem deste dispositivo.</span></footer>

      {showSettings && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowSettings(false); }}>
          <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="modal-header"><div><p className="eyebrow">PREFERÊNCIAS</p><h2 id="settings-title">Configurações</h2></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Fechar configurações">×</button></div>
            <div className="field-grid">
              <label>Largura <div className="number-field"><input type="number" min="1" max="4096" value={settings.width} onChange={(e) => setSettings({ ...settings, width: Math.min(4096, Math.max(1, Number(e.target.value))) })} /><span>px</span></div></label>
              <label>Altura <div className="number-field"><input type="number" min="1" max="4096" value={settings.height} onChange={(e) => setSettings({ ...settings, height: Math.min(4096, Math.max(1, Number(e.target.value))) })} /><span>px</span></div></label>
            </div>
            <label className="range-field"><span><b>Qualidade WebP</b><output>{settings.quality}%</output></span><input type="range" min="1" max="100" value={settings.quality} onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })} /></label>
            <label className="select-field">Tema<select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value as Settings["theme"] })}><option value="system">Seguir o sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label>
            <div className="setting-note"><strong>Como o redimensionamento funciona</strong><p>A imagem mantém a proporção, é centralizada e recebe bordas transparentes quando necessário. Nunca haverá distorção.</p></div>
            <button className="button primary full" onClick={() => setShowSettings(false)}>Salvar configurações</button>
          </section>
        </div>
      )}
    </main>
  );
}
