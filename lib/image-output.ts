import type { ConversionSettings } from "@/lib/conversion-settings";

const mimeTypes: Record<ConversionSettings["outputFormat"], string> = {
  webp: "image/webp",
  avif: "image/avif",
  png: "image/png",
  jpg: "image/jpeg",
  ico: "image/x-icon",
};

export function outputName(name: string, format: ConversionSettings["outputFormat"]) {
  return `${name.replace(/\.[^.]+$/, "")}.${format}`;
}

export async function encodeCanvas(canvas: HTMLCanvasElement, settings: ConversionSettings) {
  if (settings.outputFormat === "avif") {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponível neste navegador.");
    const { default: encode } = await import("@jsquash/avif/encode.js");
    const buffer = await encode(context.getImageData(0, 0, canvas.width, canvas.height), {
      quality: settings.quality,
      speed: 6,
    });
    return new Blob([buffer], { type: mimeTypes.avif });
  }

  if (settings.outputFormat === "ico") {
    if (canvas.width > 256 || canvas.height > 256)
      throw new Error("Ícones ICO aceitam dimensões de até 256 × 256.");
    const png = await canvasToBlob(canvas, "image/png");
    return createIcoBlob(await png.arrayBuffer(), canvas.width, canvas.height);
  }

  const quality = settings.outputFormat === "png" ? undefined : settings.quality / 100;
  return canvasToBlob(canvas, mimeTypes[settings.outputFormat], quality);
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || (mimeType !== "image/x-icon" && blob.type !== mimeType)) {
        reject(new Error(`Seu navegador não conseguiu gerar ${mimeType}.`));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
}

function createIcoBlob(png: ArrayBuffer, width: number, height: number) {
  const headerSize = 22;
  const output = new Uint8Array(headerSize + png.byteLength);
  const view = new DataView(output.buffer);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  output[6] = width === 256 ? 0 : width;
  output[7] = height === 256 ? 0 : height;
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, png.byteLength, true);
  view.setUint32(18, headerSize, true);
  output.set(new Uint8Array(png), headerSize);
  return new Blob([output], { type: mimeTypes.ico });
}
