"use client";

import { useEffect, useState } from "react";
import { conversionPresets, fitModeOptions, outputFormatOptions, type ConversionSettings, type CustomConversionProfile } from "@/lib/conversion-settings";
import { translate } from "@/lib/i18n";

type SettingsPanelProps = {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  onClose: () => void;
};

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  const tr = (key: Parameters<typeof translate>[1]) => translate(settings.language, key);
  const [profiles, setProfiles] = useState<CustomConversionProfile[]>([]);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    try { setProfiles(JSON.parse(localStorage.getItem("webp-forge-custom-profiles") ?? "[]")); } catch { setProfiles([]); }
  }, []);

  function persistProfiles(next: CustomConversionProfile[]) {
    setProfiles(next);
    localStorage.setItem("webp-forge-custom-profiles", JSON.stringify(next));
  }

  function saveProfile() {
    const name = profileName.trim();
    if (!name) return;
    const profile = { id: crypto.randomUUID(), name, width: settings.width, height: settings.height, quality: settings.quality, fitMode: settings.fitMode, outputFormat: settings.outputFormat };
    persistProfiles([...profiles.filter((item) => item.name.toLowerCase() !== name.toLowerCase()), profile]);
    setProfileName("");
  }
  function update(values: Partial<ConversionSettings>) {
    onChange({ ...settings, ...values });
  }

  function selectOutputFormat(outputFormat: ConversionSettings["outputFormat"]) {
    update(outputFormat === "ico"
      ? { outputFormat, width: Math.min(settings.width, 256), height: Math.min(settings.height, 256) }
      : { outputFormat });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-header"><div><p className="eyebrow">{tr("preferences")}</p><h2 id="settings-title">{tr("settings")}</h2></div><button className="icon-button" onClick={onClose} aria-label={tr("close")}>×</button></div>
        <fieldset className="preset-fieldset">
          <legend>{tr("quickProfiles")}</legend>
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
        <fieldset className="preset-fieldset custom-profiles">
          <legend>{tr("customProfiles")}</legend>
          <p>Salve a configuração atual para reutilizar quando quiser.</p>
          <div className="profile-create"><input value={profileName} maxLength={40} placeholder="Nome do perfil" onChange={(event) => setProfileName(event.target.value)} /><button type="button" className="button secondary" onClick={saveProfile} disabled={!profileName.trim()}>Salvar atual</button></div>
          {profiles.length > 0 && <div className="profile-list">{profiles.map((profile) => <div key={profile.id}><button type="button" onClick={() => update(profile)}><strong>{profile.name}</strong><small>{profile.width} × {profile.height} · {profile.outputFormat.toUpperCase()} · {profile.quality}%</small></button><button type="button" className="profile-delete" onClick={() => persistProfiles(profiles.filter((item) => item.id !== profile.id))} aria-label={`Excluir ${profile.name}`}>×</button></div>)}</div>}
        </fieldset>
        <div className="field-grid">
          <label>Largura <div className="number-field"><input type="number" min="1" max="4096" value={settings.width} onChange={(event) => update({ width: Math.min(4096, Math.max(1, Number(event.target.value))) })} /><span>px</span></div></label>
          <label>Altura <div className="number-field"><input type="number" min="1" max="4096" value={settings.height} onChange={(event) => update({ height: Math.min(4096, Math.max(1, Number(event.target.value))) })} /><span>px</span></div></label>
        </div>
        <fieldset className="fit-fieldset">
          <legend>Modo de ajuste</legend>
          <div className="fit-options">
            {fitModeOptions.map((option) => (
              <button type="button" key={option.value} className={settings.fitMode === option.value ? "selected" : ""}
                aria-pressed={settings.fitMode === option.value} onClick={() => update({ fitMode: option.value })}>
                {option.name}
              </button>
            ))}
          </div>
          <p>{fitModeOptions.find((option) => option.value === settings.fitMode)?.description}</p>
        </fieldset>
        <label className="select-field">Formato de saída
          <select value={settings.outputFormat} onChange={(event) => selectOutputFormat(event.target.value as ConversionSettings["outputFormat"])}>
            {outputFormatOptions.map((option) => <option value={option.value} key={option.value}>{option.name}</option>)}
          </select>
          <small>{outputFormatOptions.find((option) => option.value === settings.outputFormat)?.description}</small>
        </label>
        <label className="range-field"><span><b>Qualidade da saída</b><output>{settings.quality}%</output></span><input type="range" min="1" max="100" value={settings.quality} onChange={(event) => update({ quality: Number(event.target.value) })} /></label>
        <label className="select-field">Tema<select value={settings.theme} onChange={(event) => update({ theme: event.target.value as ConversionSettings["theme"] })}><option value="system">Seguir o sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label>
        <label className="select-field">{tr("language")}<select value={settings.language} onChange={(event) => update({ language: event.target.value as ConversionSettings["language"] })}><option value="pt">Português</option><option value="en">English</option><option value="es">Español</option></select></label>
        <div className="setting-note"><strong>Metadados protegidos</strong><p>A versão web remove EXIF, localização e outros metadados automaticamente durante a conversão pelo navegador.</p></div>
        <div className="setting-note"><strong>Processamento local</strong><p>O modo escolhido é aplicado no navegador. Suas imagens não são enviadas para nenhum servidor.</p></div>
        <button className="button primary full" onClick={onClose}>{tr("saveSettings")}</button>
      </section>
    </div>
  );
}
