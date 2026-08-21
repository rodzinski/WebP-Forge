const formats = ["WEBP", "AVIF", "PNG", "JPG"];

interface AmbientBackdropProps {
  subtle?: boolean;
}

export function AmbientBackdrop({ subtle = false }: AmbientBackdropProps) {
  return (
    <div className={`ambient-backdrop${subtle ? " ambient-backdrop-subtle" : ""}`} aria-hidden="true">
      <div className="ambient-glow ambient-glow-lime" />
      <div className="ambient-glow ambient-glow-blue" />
      <div className="ambient-format-field">
        {formats.map((format, index) => (
          <span className={`ambient-format ambient-format-${index + 1}`} key={format}>
            <i />
            {format}
          </span>
        ))}
      </div>
    </div>
  );
}
