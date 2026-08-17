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

test("offers portable, installer and ARM64 Windows downloads", async () => {
  const download = await readFile(new URL("../components/landing/desktop-download.tsx", import.meta.url), "utf8");
  assert.match(download, /WebP-Forge-win-x64\.zip/);
  assert.match(download, /WebP-Forge-Setup-win-x64\.exe/);
  assert.match(download, /WebP-Forge-portable-win-arm64\.zip/);
});

test("synchronizes the current version and changelog with GitHub releases", async () => {
  const [source, changelog, download] = await Promise.all([
    readFile(new URL("../lib/github-releases.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/changelog/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/desktop-download.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(source, /api\.github\.com\/repos\/rodzinski\/WebP-Forge\/releases/);
  assert.match(source, /replace\(\/\^v\\\.\/i, "v"\)/);
  assert.match(changelog, /<ReleaseList \/>/);
  assert.match(download, /<ReleaseVersion \/>/);
  assert.doesNotMatch(download, /versão 1\.\d+\.\d+/);
});

test("publishes educational guides for supported image formats", async () => {
  const [formats, index, detail] = await Promise.all([
    readFile(new URL("../lib/image-formats.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/formats/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/formats/[slug]/page.tsx", import.meta.url), "utf8"),
  ]);
  for (const format of ["webp", "avif", "png", "jpg", "gif", "ico"]) assert.match(formats, new RegExp(`slug: "${format}"`));
  assert.match(index, /<FormatComparison \/>/);
  assert.match(detail, /generateStaticParams/);
  assert.match(detail, /Converter imagens/);
});

test("loads privacy-friendly analytics only after explicit consent", async () => {
  const [consent, layout, privacy] = await Promise.all([
    readFile(new URL("../components/analytics/analytics-consent.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(consent, /NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN/);
  assert.match(consent, /consent === "granted"/);
  assert.match(consent, /static\.cloudflareinsights\.com\/beacon\.min\.js/);
  assert.match(consent, /Nenhuma imagem, nome de arquivo ou histórico é enviado/);
  assert.match(layout, /<AnalyticsConsent \/>/);
  assert.doesNotMatch(layout, /cloudflareinsights/);
  assert.match(privacy, /somente após consentimento explícito/);
});

test("offers a privacy-conscious feedback channel", async () => {
  const [page, form, header, footer] = await Promise.all([
    readFile(new URL("../app/feedback/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/feedback/feedback-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/site-footer.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Sua experiência/);
  assert.match(form, /github\.com\/rodzinski\/WebP-Forge\/issues\/new/);
  assert.match(form, /Nenhuma imagem é anexada/);
  assert.match(header, /\/feedback/);
  assert.match(footer, /Enviar feedback/);
});

test("publishes a public roadmap connected to feedback and changelog", async () => {
  const [page, board, header, footer] = await Promise.all([
    readFile(new URL("../app/roadmap/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/roadmap/roadmap-board.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/site-footer.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /prioridades, não promessas de data/);
  assert.match(page, /href="\/changelog"/);
  assert.match(page, /href="\/feedback"/);
  assert.match(board, /Entregue/);
  assert.match(board, /Em andamento/);
  assert.match(board, /Explorando/);
  assert.match(header, /\/roadmap/);
  assert.match(footer, /Roadmap/);
});

test("offers transparent community support with an optional financial channel", async () => {
  const [page, docs, header, footer] = await Promise.all([
    readFile(new URL("../app/support/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../docs/SUPPORT.md", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/site-footer.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /NEXT_PUBLIC_SUPPORT_URL/);
  assert.match(page, /github\.com\/sponsors\/rodzinski/);
  assert.match(page, /Apoiar pelo GitHub Sponsors/);
  assert.match(page, /github\.com\/rodzinski\/WebP-Forge/);
  assert.match(docs, /Nunca coloque chaves Pix privadas/);
  assert.match(header, /\/support/);
  assert.match(footer, /Apoie o projeto/);
});

test("publishes a complete privacy policy and links it from the footer", async () => {
  const [privacy, footer] = await Promise.all([
    readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing/site-footer.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(privacy, /Política de Privacidade/);
  assert.match(privacy, /não são enviadas aos servidores do WebP Forge/);
  assert.match(privacy, /Cloudflare/);
  assert.match(privacy, /14 de agosto de 2026/);
  assert.match(privacy, /API pública do GitHub/);
  assert.match(privacy, /Imagens, histórico e configurações não são enviados/);
  assert.match(footer, /href="\/privacy"/);
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
  assert.match(comparison, /beforeAfter/);
  assert.match(comparison, /URL\.createObjectURL\(output\)/);
  assert.match(comparison, /output\.size/);
  assert.doesNotMatch(comparison, /\bfetch\s*\(/);
});

test("explains automatic metadata removal in the browser", async () => {
  const settings = await readFile(new URL("../components/app/settings-panel.tsx", import.meta.url), "utf8");
  assert.match(settings, /remove EXIF, localização e outros metadados automaticamente/);
});

test("detects animated GIF and WebP inputs and warns about first-frame output", async () => {
  const page = await readFile(appPageUrl, "utf8");
  assert.match(page, /detectFrameCount/);
  assert.match(page, /0x41.*0x4e.*0x4d.*0x46/s);
  assert.match(page, /saída pelo 1º quadro/);
});

test("stores reusable custom conversion profiles locally", async () => {
  const settings = await readFile(new URL("../components/app/settings-panel.tsx", import.meta.url), "utf8");
  assert.match(settings, /webp-forge-custom-profiles/);
  assert.match(settings, /saveProfile/);
  assert.match(settings, /Excluir/);
});

test("reorders and cancels individual batch items", async () => {
  const page = await readFile(appPageUrl, "utf8");
  assert.match(page, /moveItem/);
  assert.match(page, /cancelItem/);
  assert.match(page, /cancelledIds/);
});

test("shows a detailed report and retries only failed items", async () => {
  const [page, report] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../components/app/conversion-report-panel.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /retryFailures/);
  assert.match(page, /ConversionReportPanel/);
  assert.match(report, /tr\("retry"\)/);
  assert.match(report, /tr\("copyReport"\)/);
});

test("stores and displays a private local conversion history", async () => {
  const [page, history] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../components/app/history-panel.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /webp-forge-history/);
  assert.match(page, /HistoryPanel/);
  assert.match(history, /tr\("recent"\)/);
  assert.match(history, /tr\("clearHistory"\)/);
});

test("supports keyboard shortcuts for the main workflow", async () => {
  const page = await readFile(appPageUrl, "utf8");
  assert.match(page, /handleShortcut/);
  assert.match(page, /event\.shiftKey/);
  assert.match(page, /shortcutActions/);
  assert.match(page, /event\.key === "Enter"/);
});

test("supports Portuguese, English and Spanish", async () => {
  const [page, settings, i18n] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../components/app/settings-panel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /settings\.language/);
  assert.match(settings, /Português/);
  assert.match(settings, /English/);
  assert.match(settings, /Español/);
  assert.match(i18n, /CONVERSIÓN POR LOTES/);
});

test("processes conversions in a Web Worker with a safe fallback", async () => {
  const [page, client, worker] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../lib/image-worker-client.ts", import.meta.url), "utf8"),
    readFile(new URL("../workers/image-conversion.worker.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /ImageWorkerClient\.isSupported/);
  assert.match(page, /return convertImage/);
  assert.match(client, /new Worker/);
  assert.match(worker, /OffscreenCanvas/);
  assert.match(worker, /transfer: \[buffer\]/);
});

test("virtualizes the image queue for very large batches", async () => {
  const [page, virtualList] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../components/app/virtual-list.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<VirtualList/);
  assert.match(virtualList, /items\.slice\(range\.start, range\.end\)/);
  assert.match(virtualList, /ResizeObserver/);
  assert.match(virtualList, /aria-posinset|ariaLabel/);
});

test("adapts conversion concurrency to the device", async () => {
  const [page, client] = await Promise.all([
    readFile(appPageUrl, "utf8"),
    readFile(new URL("../lib/image-worker-client.ts", import.meta.url), "utf8"),
  ]);
  assert.match(client, /navigator\.hardwareConcurrency/);
  assert.match(client, /deviceMemory/);
  assert.match(client, /pointer: coarse/);
  assert.match(client, /Array\.from\(\{ length: concurrency \}/);
  assert.match(page, /Promise\.all\(Array\.from/);
  assert.match(page, /results\.get\(item\.id\)/);
});

test("benchmarks quality, memory and conversion speed locally", async () => {
  const [page, benchmark] = await Promise.all([
    readFile(new URL("../app/benchmark/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/image-benchmark.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /runImageBenchmark/);
  assert.match(await readFile(appPageUrl, "utf8"), /href="\/benchmark"/);
  assert.match(page, /PSNR/);
  assert.match(benchmark, /calculatePsnr/);
  assert.match(benchmark, /usedJSHeapSize/);
  assert.match(benchmark, /megapixelsPerSecond/);
  assert.match(benchmark, /compressionRatio/);
});
