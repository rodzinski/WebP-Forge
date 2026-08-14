import { imageFormats } from "@/lib/image-formats";

export function FormatComparison() {
  return <div className="format-table-wrap"><table className="format-table">
    <thead><tr><th>Formato</th><th>Ideal para</th><th>Compressão</th><th>Transparência</th><th>Animação</th></tr></thead>
    <tbody>{imageFormats.map((format) => <tr key={format.slug}><th>{format.name}</th><td>{format.idealFor}</td><td>{format.compression}</td><td>{format.transparency}</td><td>{format.animation}</td></tr>)}</tbody>
  </table></div>;
}
