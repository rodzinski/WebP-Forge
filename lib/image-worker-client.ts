import type { ConversionSettings } from "@/lib/conversion-settings";
import type { ConvertImageResponse } from "@/lib/image-worker-protocol";

type PendingConversion = { resolve: (blob: Blob) => void; reject: (error: Error) => void };
type QueuedConversion = { id: string; file: File; settings: ConversionSettings };
type WorkerSlot = { worker: Worker; busyId: string | null };
type NavigatorWithMemory = Navigator & { deviceMemory?: number };

export class ImageWorkerClient {
  private readonly slots: WorkerSlot[];
  private readonly pending = new Map<string, PendingConversion>();
  private queue: QueuedConversion[] = [];

  static isSupported() {
    return typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && typeof createImageBitmap !== "undefined";
  }

  static recommendedConcurrency() {
    if (typeof navigator === "undefined") return 1;
    const cores = Math.max(1, navigator.hardwareConcurrency || 2);
    const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;
    const cpuLimit = Math.max(1, Math.floor(cores / 2));
    const memoryLimit = memory <= 2 ? 1 : memory <= 4 ? 2 : 4;
    const mobileLimit = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches ? 2 : 4;
    return Math.max(1, Math.min(cpuLimit, memoryLimit, mobileLimit));
  }

  constructor(public readonly concurrency = ImageWorkerClient.recommendedConcurrency()) {
    this.slots = Array.from({ length: concurrency }, () => this.createSlot());
  }

  convert(id: string, file: File, settings: ConversionSettings) {
    return new Promise<Blob>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.queue.push({ id, file, settings });
      this.drain();
    });
  }

  cancel(id: string) {
    const conversion = this.pending.get(id);
    if (!conversion) return;
    this.pending.delete(id);
    this.queue = this.queue.filter((item) => item.id !== id);
    conversion.reject(new DOMException("Conversão cancelada.", "AbortError"));
  }

  dispose() {
    this.slots.forEach(({ worker }) => worker.terminate());
    this.pending.forEach(({ reject }) => reject(new Error("Worker encerrado.")));
    this.pending.clear();
    this.queue = [];
  }

  private createSlot(): WorkerSlot {
    const slot: WorkerSlot = {
      worker: new Worker(new URL("../workers/image-conversion.worker.ts", import.meta.url), { type: "module" }),
      busyId: null,
    };
    slot.worker.addEventListener("message", (event: MessageEvent<ConvertImageResponse>) => this.handleMessage(slot, event.data));
    slot.worker.addEventListener("error", (event) => this.handleWorkerError(slot, event));
    return slot;
  }

  private drain() {
    for (const slot of this.slots) {
      if (slot.busyId) continue;
      let next = this.queue.shift();
      while (next && !this.pending.has(next.id)) next = this.queue.shift();
      if (!next) return;
      slot.busyId = next.id;
      slot.worker.postMessage({ type: "convert", id: next.id, file: next.file, settings: next.settings });
    }
  }

  private handleMessage(slot: WorkerSlot, response: ConvertImageResponse) {
    const conversion = this.pending.get(response.id);
    this.pending.delete(response.id);
    slot.busyId = null;
    if (conversion) {
      if (response.type === "failure") conversion.reject(new Error(response.error));
      else conversion.resolve(new Blob([response.buffer], { type: response.mimeType }));
    }
    this.drain();
  }

  private handleWorkerError(slot: WorkerSlot, event: ErrorEvent) {
    if (slot.busyId) {
      this.pending.get(slot.busyId)?.reject(new Error(event.message || "Falha no processador de imagens."));
      this.pending.delete(slot.busyId);
    }
    slot.worker.terminate();
    const replacement = this.createSlot();
    const index = this.slots.indexOf(slot);
    if (index >= 0) this.slots[index] = replacement;
    this.drain();
  }
}
