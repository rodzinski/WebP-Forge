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
  const page = await readFile(appPageUrl, "utf8");

  assert.doesNotMatch(page, /\bfetch\s*\(/);
  assert.doesNotMatch(page, /XMLHttpRequest|FormData/);
  assert.match(page, /canvas\.toBlob/);
  assert.match(page, /image\/webp/);
});
