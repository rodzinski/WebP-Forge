import type { ConversionSettings } from "@/lib/conversion-settings";
import type { ConvertImageResponse } from "@/lib/image-worker-protocol";

type PendingConversion = {
  resolve: (blob: Blob) => void;
  reject: (error: Error) => void;
};

export class ImageWorkerClient {
  private readonly worker: Worker;
  private readonly pending = new Map<string, PendingConversion>();

  static isSupported() {
    return typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && typeof createImageBitmap !== "undefined";
  }

  constructor() {
    this.worker = new Worker(new URL("../workers/image-conversion.worker.ts", import.meta.url), { type: "module" });
    this.worker.addEventListener("message", this.handleMessage);
    this.worker.addEventListener("error", this.handleWorkerError);
  }

  convert(id: string, file: File, settings: ConversionSettings) {
    return new Promise<Blob>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ type: "convert", id, file, settings });
    });
  }

  cancel(id: string) {
    const conversion = this.pending.get(id);
    if (!conversion) return;
    this.pending.delete(id);
    conversion.reject(new DOMException("Conversão cancelada.", "AbortError"));
  }

  dispose() {
    this.worker.terminate();
    this.pending.forEach(({ reject }) => reject(new Error("Worker encerrado.")));
    this.pending.clear();
  }

  private readonly handleMessage = (event: MessageEvent<ConvertImageResponse>) => {
    const conversion = this.pending.get(event.data.id);
    if (!conversion) return;
    this.pending.delete(event.data.id);
    if (event.data.type === "failure") {
      conversion.reject(new Error(event.data.error));
      return;
    }
    conversion.resolve(new Blob([event.data.buffer], { type: event.data.mimeType }));
  };

  private readonly handleWorkerError = (event: ErrorEvent) => {
    const error = new Error(event.message || "Falha no processador de imagens.");
    this.pending.forEach(({ reject }) => reject(error));
    this.pending.clear();
  };
}
