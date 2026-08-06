"use client";

import { conversionPresets, type ConversionSettings } from "@/lib/conversion-settings";

type SettingsPanelProps = {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  onClose: () => void;
};

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  function update(values: Partial<ConversionSettings>) {
    onChange({ ...settings, ...values });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-header"><div><p className="eyebrow">PREFERÊNCIAS</p><h2 id="settings-title">Configurações</h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar configurações">×</button></div>
        <fieldset className="preset-fieldset">
          <legend>Perfis rápidos</legend>
          <p>Escolha um ponto de partida e ajuste como preferir.</p>
          <div className="preset-grid">
            {conversionPresets.map((preset) => {
              const selected = settings.width === preset.width && settings.height === preset.height && settings.quality === preset.quality;
              return (
                <button type="button" className={`preset-option ${selected ? "selected" : ""}`} aria-pressed={selected} key={preset.id}
                  onClick={() => update({ width: preset.width, height: preset.height, quality: preset.quality })}>
                  <span><strong>{preset.name}</strong><small>{preset.description}</small></span>
                  <span><b>{preset.width} × {preset.height}</b><small>{preset.quality}%</small></span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="field-grid">
          <label>Largura <div className="number-field"><input type="number" min="1" max="4096" value={settings.width} onChange={(event) => update({ width: Math.min(4096, Math.max(1, Number(event.target.value))) })} /><span>px</span></div></label>
          <label>Altura <div className="number-field"><input type="number" min="1" max="4096" value={settings.height} onChange={(event) => update({ height: Math.min(4096, Math.max(1, Number(event.target.value))) })} /><span>px</span></div></label>
        </div>
        <label className="range-field"><span><b>Qualidade WebP</b><output>{settings.quality}%</output></span><input type="range" min="1" max="100" value={settings.quality} onChange={(event) => update({ quality: Number(event.target.value) })} /></label>
        <label className="select-field">Tema<select value={settings.theme} onChange={(event) => update({ theme: event.target.value as ConversionSettings["theme"] })}><option value="system">Seguir o sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label>
        <div className="setting-note"><strong>Como o redimensionamento funciona</strong><p>A imagem mantém a proporção, é centralizada e recebe bordas transparentes quando necessário. Nunca haverá distorção.</p></div>
        <button className="button primary full" onClick={onClose}>Salvar configurações</button>
      </section>
    </div>
  );
}
