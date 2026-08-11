import type { ConversionSettings } from "@/lib/conversion-settings";
import { ImageWorkerClient } from "@/lib/image-worker-client";

export type BenchmarkResult = {
  quality: number;
  durationMs: number;
  outputBytes: number;
  compressionRatio: number;
  megapixelsPerSecond: number;
  psnr: number;
  heapDeltaBytes: number | null;
};

type PerformanceWithMemory = Performance & { memory?: { usedJSHeapSize: number } };

const scenarios = [70, 85, 95] as const;
const benchmarkSize = 768;

export async function runImageBenchmark(onProgress?: (completed: number, total: number) => void) {
  if (!ImageWorkerClient.isSupported()) throw new Error("Este navegador não oferece os recursos necessários para executar o benchmark.");
  const source = await createReferenceImage(benchmarkSize);
  const sourcePixels = await decodePixels(source, benchmarkSize);
  const client = new ImageWorkerClient(1);
  const results: BenchmarkResult[] = [];

  try {
    for (const quality of scenarios) {
      const settings: ConversionSettings = {
        width: benchmarkSize, height: benchmarkSize, quality, fitMode: "contain",
        outputFormat: "webp", theme: "system", language: "pt",
      };
      const heapBefore = heapUsage();
      const startedAt = performance.now();
      const output = await client.convert(`benchmark-${quality}`, source, settings);
      const durationMs = performance.now() - startedAt;
      const heapAfter = heapUsage();
      const outputPixels = await decodePixels(output, benchmarkSize);
      results.push({
        quality,
        durationMs,
        outputBytes: output.size,
        compressionRatio: 1 - output.size / source.size,
        megapixelsPerSecond: (benchmarkSize * benchmarkSize / 1_000_000) / (durationMs / 1000),
        psnr: calculatePsnr(sourcePixels, outputPixels),
        heapDeltaBytes: heapBefore === null || heapAfter === null ? null : Math.max(0, heapAfter - heapBefore),
      });
      onProgress?.(results.length, scenarios.length);
    }
  } finally {
    client.dispose();
  }
  return { sourceBytes: source.size, width: benchmarkSize, height: benchmarkSize, results };
}

async function createReferenceImage(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas indisponível.");
  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#0c2340"); gradient.addColorStop(.48, "#2b9ab7"); gradient.addColorStop(1, "#d7ff75");
  context.fillStyle = gradient; context.fillRect(0, 0, size, size);
  for (let index = 0; index < 90; index += 1) {
    const x = pseudoRandom(index * 3 + 1) * size;
    const y = pseudoRandom(index * 3 + 2) * size;
    const radius = 8 + pseudoRandom(index * 3 + 3) * 54;
    context.fillStyle = `hsla(${Math.round(pseudoRandom(index + 91) * 360)}, 80%, 65%, .42)`;
    context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
  }
  context.fillStyle = "rgba(10, 16, 20, .86)"; context.font = "700 82px sans-serif";
  context.fillText("WebP Forge", 54, size - 70);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Falha ao criar a referência.")), "image/png"));
  return new File([blob], "webp-forge-benchmark.png", { type: blob.type });
}

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

async function decodePixels(blob: Blob, size: number) {
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas indisponível.");
    context.drawImage(bitmap, 0, 0, size, size);
    return context.getImageData(0, 0, size, size).data;
  } finally {
    bitmap.close();
  }
}

function calculatePsnr(reference: Uint8ClampedArray, output: Uint8ClampedArray) {
  let squaredError = 0;
  let samples = 0;
  for (let index = 0; index < reference.length; index += 4) {
    for (let channel = 0; channel < 3; channel += 1) {
      const difference = reference[index + channel] - output[index + channel];
      squaredError += difference * difference;
      samples += 1;
    }
  }
  if (!squaredError) return Number.POSITIVE_INFINITY;
  return 10 * Math.log10((255 * 255) / (squaredError / samples));
}

function heapUsage() {
  return (performance as PerformanceWithMemory).memory?.usedJSHeapSize ?? null;
}
