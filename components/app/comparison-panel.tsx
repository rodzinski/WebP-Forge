"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type ComparisonPanelProps = {
  name: string;
  originalUrl: string;
  originalSize: number;
  output: Blob;
  outputFormat: string;
  onClose: () => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function differenceLabel(original: number, output: number) {
  const difference = (1 - output / original) * 100;
  return difference >= 0 ? `${difference.toFixed(1)}% menor` : `${Math.abs(difference).toFixed(1)}% maior`;
}

export function ComparisonPanel({ name, originalUrl, originalSize, output, outputFormat, onClose }: ComparisonPanelProps) {
  const [outputUrl, setOutputUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(output);
    setOutputUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [output]);

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={onClose}>
      <motion.section className="comparison-panel" role="dialog" aria-modal="true" aria-labelledby="comparison-title"
        initial={{ opacity: 0, scale: .98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .2 }}
        onMouseDown={(event) => event.stopPropagation()}>
        <header className="comparison-header">
          <div><span>COMPARAÇÃO VISUAL</span><h2 id="comparison-title">Antes e depois</h2><p title={name}>{name}</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar comparação">×</button>
        </header>
        <div className="comparison-images">
          <figure><figcaption>ORIGINAL</figcaption><div><Image src={originalUrl} alt={`Imagem original ${name}`} fill unoptimized /></div></figure>
          <figure className="comparison-output"><figcaption>RESULTADO · {outputFormat.toUpperCase()}</figcaption><div>{outputUrl && <Image src={outputUrl} alt={`Resultado convertido ${name}`} fill unoptimized />}</div></figure>
        </div>
        <div className="comparison-stats">
          <div><span>ORIGINAL</span><strong>{formatBytes(originalSize)}</strong></div>
          <div><span>RESULTADO</span><strong>{formatBytes(output.size)}</strong></div>
          <div><span>DIFERENÇA</span><strong>{differenceLabel(originalSize, output.size)}</strong></div>
        </div>
      </motion.section>
    </motion.div>
  );
}
