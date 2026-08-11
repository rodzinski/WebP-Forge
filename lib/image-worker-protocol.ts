import type { ConversionSettings } from "@/lib/conversion-settings";

export type WorkerConversionSettings = Pick<ConversionSettings, "width" | "height" | "quality" | "fitMode" | "outputFormat">;

export type ConvertImageRequest = {
  type: "convert";
  id: string;
  file: File;
  settings: WorkerConversionSettings;
};

export type ConvertImageSuccess = {
  type: "success";
  id: string;
  buffer: ArrayBuffer;
  mimeType: string;
};

export type ConvertImageFailure = {
  type: "failure";
  id: string;
  error: string;
};

export type ConvertImageResponse = ConvertImageSuccess | ConvertImageFailure;
