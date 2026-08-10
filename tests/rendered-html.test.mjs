import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appPageUrl = new URL("../app/app/page.tsx", import.meta.url);

test("accepts AVIF as a local input format", async () => {
  const page = await readFile(appPageUrl, "utf8");

  assert.match(page, /supportedExtensions[^;]+"avif"/s);
  assert.match(page, /accept="[^"]*\.avif[^"]*"/);
  assert.match(page, /createImageBitmap\(file\)/);
});

test("keeps image conversion on the device", async () => {
  const [page, output] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../lib/image-output.ts", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /\bfetch\s*\(/);
  assert.doesNotMatch(page, /XMLHttpRequest|FormData/);
  assert.match(output, /canvas\.toBlob/);
  assert.match(output, /import\("@jsquash\/avif\/encode\.js"\)/);
});

test("exports WebP, AVIF, PNG, JPG and ICO", async () => {
  const settings = await readFile(new URL("../lib/conversion-settings.ts", import.meta.url), "utf8");
  assert.match(settings, /"webp" \| "avif" \| "png" \| "jpg" \| "ico"/);
});

test("offers contain, crop and stretch fitting modes", async () => {
  const [page, settings] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../lib/conversion-settings.ts", import.meta.url), "utf8"),
  ]);

  assert.match(settings, /"contain" \| "crop" \| "stretch"/);
  assert.match(settings, /name: "Conter"/);
  assert.match(settings, /name: "Recortar"/);
  assert.match(settings, /name: "Esticar"/);
  assert.match(page, /settings\.fitMode === "crop"/);
  assert.match(page, /settings\.fitMode === "stretch"/);
});

test("offers local before-and-after comparison with size savings", async () => {
  const [page, comparison] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../components/app/comparison-panel.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /setComparisonId/);
  assert.match(page, /output\?\.size/);
  assert.match(comparison, /Antes e depois/);
  assert.match(comparison, /URL\.createObjectURL\(output\)/);
  assert.match(comparison, /output\.size/);
  assert.doesNotMatch(comparison, /\bfetch\s*\(/);
});
