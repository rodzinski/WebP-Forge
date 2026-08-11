export type AppLocale = "pt" | "en" | "es";

const messages = {
  pt: {
    imageConverter: "Conversor de imagens", privacy: "Processamento local e privado", history: "Histórico", settings: "Configurações",
    eyebrow: "CONVERSÃO EM LOTE", heroA: "Imagens perfeitas.", heroB: "Prontas para a web.", intro: "Converta várias imagens para WebP, AVIF, PNG, JPG ou ICO com tamanho uniforme e alta qualidade.",
    addImages: "Adicionar imagens", addFolder: "Adicionar pasta", drop: "Solte suas imagens aqui", select: "ou clique para selecionar arquivos", clear: "Limpar lista", output: "SAÍDA", download: "Baixar ZIP", convert: "Converter para", converting: "Convertendo…", footer: "Seus arquivos nunca saem deste dispositivo.",
    preferences: "PREFERÊNCIAS", quickProfiles: "Perfis rápidos", customProfiles: "Meus perfis", language: "Idioma", saveSettings: "Salvar configurações",
    localHistory: "HISTÓRICO LOCAL", recent: "Conversões recentes", clearHistory: "Limpar histórico", noHistory: "Nenhuma conversão registrada",
    batchReport: "RELATÓRIO DO LOTE", complete: "Conversão concluída", retry: "Tentar novamente somente as falhas", copyReport: "Copiar relatório", close: "Fechar",
    visualComparison: "COMPARAÇÃO VISUAL", beforeAfter: "Antes e depois", original: "ORIGINAL", result: "RESULTADO", difference: "DIFERENÇA",
    ready: "Pronto", completed: "Concluído", error: "Erro", cancelled: "Cancelado", total: "TOTAL", successes: "SUCESSOS", failures: "FALHAS", finalSize: "TAMANHO FINAL",
  },
  en: {
    imageConverter: "Image converter", privacy: "Local and private processing", history: "History", settings: "Settings",
    eyebrow: "BATCH CONVERSION", heroA: "Perfect images.", heroB: "Ready for the web.", intro: "Convert multiple images to WebP, AVIF, PNG, JPG or ICO with consistent dimensions and high quality.",
    addImages: "Add images", addFolder: "Add folder", drop: "Drop your images here", select: "or click to select files", clear: "Clear list", output: "OUTPUT", download: "Download ZIP", convert: "Convert to", converting: "Converting…", footer: "Your files never leave this device.",
    preferences: "PREFERENCES", quickProfiles: "Quick presets", customProfiles: "My presets", language: "Language", saveSettings: "Save settings",
    localHistory: "LOCAL HISTORY", recent: "Recent conversions", clearHistory: "Clear history", noHistory: "No conversions recorded",
    batchReport: "BATCH REPORT", complete: "Conversion complete", retry: "Retry failures only", copyReport: "Copy report", close: "Close",
    visualComparison: "VISUAL COMPARISON", beforeAfter: "Before and after", original: "ORIGINAL", result: "RESULT", difference: "DIFFERENCE",
    ready: "Ready", completed: "Completed", error: "Error", cancelled: "Cancelled", total: "TOTAL", successes: "SUCCESSES", failures: "FAILURES", finalSize: "FINAL SIZE",
  },
  es: {
    imageConverter: "Conversor de imágenes", privacy: "Procesamiento local y privado", history: "Historial", settings: "Configuración",
    eyebrow: "CONVERSIÓN POR LOTES", heroA: "Imágenes perfectas.", heroB: "Listas para la web.", intro: "Convierte varias imágenes a WebP, AVIF, PNG, JPG o ICO con dimensiones uniformes y alta calidad.",
    addImages: "Añadir imágenes", addFolder: "Añadir carpeta", drop: "Suelta tus imágenes aquí", select: "o haz clic para seleccionar archivos", clear: "Limpiar lista", output: "SALIDA", download: "Descargar ZIP", convert: "Convertir a", converting: "Convirtiendo…", footer: "Tus archivos nunca salen de este dispositivo.",
    preferences: "PREFERENCIAS", quickProfiles: "Perfiles rápidos", customProfiles: "Mis perfiles", language: "Idioma", saveSettings: "Guardar configuración",
    localHistory: "HISTORIAL LOCAL", recent: "Conversiones recientes", clearHistory: "Borrar historial", noHistory: "No hay conversiones registradas",
    batchReport: "INFORME DEL LOTE", complete: "Conversión completada", retry: "Reintentar solo los fallos", copyReport: "Copiar informe", close: "Cerrar",
    visualComparison: "COMPARACIÓN VISUAL", beforeAfter: "Antes y después", original: "ORIGINAL", result: "RESULTADO", difference: "DIFERENCIA",
    ready: "Listo", completed: "Completado", error: "Error", cancelled: "Cancelado", total: "TOTAL", successes: "ÉXITOS", failures: "FALLOS", finalSize: "TAMAÑO FINAL",
  },
} as const;

export type TranslationKey = keyof typeof messages.pt;
export function translate(locale: AppLocale, key: TranslationKey) { return messages[locale][key]; }
