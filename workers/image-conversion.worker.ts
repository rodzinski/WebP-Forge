/// <reference lib="webworker" />

import type { ConvertImageRequest, ConvertImageResponse, WorkerConversionSettings } from "@/lib/image-worker-protocol";

const mimeTypes = {
  webp: "image/webp",
  avif: "image/avif",
  png: "image/png",
  jpg: "image/jpeg",
  ico: "image/x-icon",
} as const;

self.addEventListener("message", async (event: MessageEvent<ConvertImageRequest>) => {
  if (event.data.type !== "convert") return;
  const { id, file, settings } = event.data;
  try {
    const blob = await convertImage(file, settings);
    const buffer = await blob.arrayBuffer();
    const response: ConvertImageResponse = { type: "success", id, buffer, mimeType: blob.type };
    self.postMessage(response, { transfer: [buffer] });
  } catch (error) {
    const response: ConvertImageResponse = {
      type: "failure",
      id,
      error: error instanceof Error ? error.message : "Falha ao converter a imagem.",
    };
    self.postMessage(response);
  }
});

async function convertImage(file: File, settings: WorkerConversionSettings) {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = new OffscreenCanvas(settings.width, settings.height);
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
    const width = settings.fitMode === "stretch" ? settings.width : Math.max(1, Math.round(bitmap.width * scale));
    const height = settings.fitMode === "stretch" ? settings.height : Math.max(1, Math.round(bitmap.height * scale));
    context.drawImage(bitmap, Math.round((settings.width - width) / 2), Math.round((settings.height - height) / 2), width, height);
    return encodeCanvas(canvas, context, settings);
  } finally {
    bitmap.close();
  }
}

async function encodeCanvas(canvas: OffscreenCanvas, context: OffscreenCanvasRenderingContext2D, settings: WorkerConversionSettings) {
  if (settings.outputFormat === "avif") {
    const { default: encode } = await import("@jsquash/avif/encode.js");
    const buffer = await encode(context.getImageData(0, 0, canvas.width, canvas.height), { quality: settings.quality, speed: 6 });
    return new Blob([buffer], { type: mimeTypes.avif });
  }

  if (settings.outputFormat === "ico") {
    if (canvas.width > 256 || canvas.height > 256) throw new Error("Ícones ICO aceitam dimensões de até 256 × 256.");
    const png = await canvas.convertToBlob({ type: mimeTypes.png });
    return createIcoBlob(await png.arrayBuffer(), canvas.width, canvas.height);
  }

  const quality = settings.outputFormat === "png" ? undefined : settings.quality / 100;
  const blob = await canvas.convertToBlob({ type: mimeTypes[settings.outputFormat], quality });
  if (blob.type !== mimeTypes[settings.outputFormat]) throw new Error(`Seu navegador não conseguiu gerar ${mimeTypes[settings.outputFormat]}.`);
  return blob;
}

function createIcoBlob(png: ArrayBuffer, width: number, height: number) {
  const headerSize = 22;
  const output = new Uint8Array(headerSize + png.byteLength);
  const view = new DataView(output.buffer);
  view.setUint16(0, 0, true); view.setUint16(2, 1, true); view.setUint16(4, 1, true);
  output[6] = width === 256 ? 0 : width; output[7] = height === 256 ? 0 : height;
  view.setUint16(10, 1, true); view.setUint16(12, 32, true);
  view.setUint32(14, png.byteLength, true); view.setUint32(18, headerSize, true);
  output.set(new Uint8Array(png), headerSize);
  return new Blob([output], { type: mimeTypes.ico });
}

export {};
