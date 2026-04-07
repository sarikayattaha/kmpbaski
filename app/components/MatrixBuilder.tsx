"use client";

export type MatrixGroup = {
  id: string;
  label: string;
  color: string;
  rows: string[][];
  pasteBuffer: string;
};

export type MatrixState = {
  columns: string[];
  groups: MatrixGroup[];
};

export const defaultMatrix: MatrixState = {
  columns: ["KOD", "EBAT", "ADET", "FİYAT"],
  groups: [],
};

const PRESET_COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#ca8a04",
  "#db2777",
  "#dc2626",
];

const uid = () => Math.random().toString(36).slice(2, 9);

export default function MatrixBuilder({
  value,
  onChange,
}: {
  value: MatrixState;
  onChange: (v: MatrixState) => void;
}) {
  /* ── Sütun işlemleri ── */
  const addCol = () =>
    onChange({ ...value, columns: [...value.columns, `Sütun ${value.columns.length + 1}`] });

  const removeCol = (ci: number) => {
    const columns = value.columns.filter((_, i) => i !== ci);
    const groups = value.groups.map((g) => ({
      ...g,
      rows: g.rows.map((r) => r.filter((_, i) => i !== ci)),
    }));
    onChange({ columns, groups });
  };

  const updateCol = (ci: number, v: string) => {
    const columns = [...value.columns];
    columns[ci] = v;
    onChange({ ...value, columns });
  };

  /* ── Grup işlemleri ── */
  const addGroup = () => {
    const group: MatrixGroup = {
      id: uid(),
      label: `Grup ${value.groups.length + 1}`,
      color: PRESET_COLORS[value.groups.length % PRESET_COLORS.length],
      rows: [Array(value.columns.length).fill("")],
      pasteBuffer: "",
    };
    onChange({ ...value, groups: [...value.groups, group] });
  };

  const removeGroup = (id: string) =>
    onChange({ ...value, groups: value.groups.filter((g) => g.id !== id) });

  const updateGroup = (id: string, patch: Partial<MatrixGroup>) =>
    onChange({
      ...value,
      groups: value.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });

  /* ── Satır işlemleri ── */
  const addRow = (id: string) => {
    const g = value.groups.find((g) => g.id === id)!;
    updateGroup(id, { rows: [...g.rows, Array(value.columns.length).fill("")] });
  };

  const removeRow = (id: string, ri: number) => {
    const g = value.groups.find((g) => g.id === id)!;
    updateGroup(id, { rows: g.rows.filter((_, i) => i !== ri) });
  };

  const updateCell = (id: string, ri: number, ci: number, v: string) => {
    const g = value.groups.find((g) => g.id === id)!;
    const rows = g.rows.map((row, i) =>
      i === ri ? row.map((c, j) => (j === ci ? v : c)) : row
    );
    updateGroup(id, { rows });
  };

  /* ── Excel yapıştır ── */
  const parsePaste = (id: string) => {
    const g = value.groups.find((g) => g.id === id)!;
    const lines = g.pasteBuffer
      .trim()
      .split("\n")
      .filter((l) => l.trim());
    const rows = lines.map((line) => {
      const cells = line.split("\t");
      while (cells.length < value.columns.length) cells.push("");
      return cells.slice(0, value.columns.length);
    });
    updateGroup(id, { rows, pasteBuffer: "" });
  };

  return (
    <div className="space-y-6">
      {/* ── SÜTUNLAR ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#07446c] uppercase tracking-wider">
            Tablo Sütunları
          </p>
          <button
            type="button"
            onClick={addCol}
            className="text-xs bg-[#e0f2fe] text-[#0f75bc] font-bold px-3 py-1.5 rounded-lg hover:bg-[#bae6fd] transition-colors"
          >
            + Sütun Ekle
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.columns.map((col, ci) => (
            <div
              key={ci}
              className="flex items-center gap-1.5 bg-white border border-blue-100 rounded-lg px-2.5 py-1.5"
            >
              <input
                value={col}
                onChange={(e) => updateCol(ci, e.target.value)}
                className="text-sm font-semibold text-[#07446c] focus:outline-none bg-transparent"
                style={{ width: Math.max(col.length * 8, 60) }}
              />
              {value.columns.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCol(ci)}
                  className="text-gray-300 hover:text-red-500 transition-colors leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── GRUPLAR ── */}
      <div className="space-y-4">
        {value.groups.map((group) => (
          <div
            key={group.id}
            className="border border-blue-100 rounded-2xl overflow-hidden"
          >
            {/* Grup header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-blue-50"
              style={{ backgroundColor: group.color + "18" }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: group.color }}
              />
              <input
                value={group.label}
                onChange={(e) => updateGroup(group.id, { label: e.target.value })}
                className="flex-1 text-sm font-bold text-[#07446c] bg-transparent focus:outline-none"
                placeholder="Grup adı (ör: 115 gr Kuşe)"
              />
              {/* Renk paletleri */}
              <div className="flex gap-1 flex-shrink-0">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateGroup(group.id, { color: c })}
                    className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 ${
                      group.color === c
                        ? "border-gray-600 scale-125"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeGroup(group.id)}
                className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors flex-shrink-0"
              >
                ✕ Sil
              </button>
            </div>

            {/* Satırlar tablosu */}
            <div className="px-4 pt-3 pb-2">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {value.columns.map((col, ci) => (
                        <th
                          key={ci}
                          className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2 pr-2"
                        >
                          {col}
                        </th>
                      ))}
                      <th className="w-6" />
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row, ri) => (
                      <tr key={ri}>
                        {value.columns.map((_, ci) => (
                          <td key={ci} className="pr-2 pb-1.5">
                            <input
                              value={row[ci] ?? ""}
                              onChange={(e) =>
                                updateCell(group.id, ri, ci, e.target.value)
                              }
                              className="w-full border border-gray-100 hover:border-blue-200 focus:border-[#0f75bc] rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0f75bc] bg-white transition-colors"
                            />
                          </td>
                        ))}
                        <td className="pb-1.5 align-middle">
                          <button
                            type="button"
                            onClick={() => removeRow(group.id, ri)}
                            className="text-gray-200 hover:text-red-400 transition-colors text-sm leading-none"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => addRow(group.id)}
                className="mt-2 text-xs text-[#0f75bc] font-semibold hover:underline"
              >
                + Satır Ekle
              </button>
            </div>

            {/* Excel yapıştır */}
            <div className="border-t border-blue-50 bg-gray-50 px-4 py-3">
              <p className="text-[11px] font-semibold text-gray-400 mb-1.5">
                Excel'den Yapıştır — Her sütun arasında Tab, her satır yeni satır
              </p>
              <div className="flex gap-2">
                <textarea
                  value={group.pasteBuffer}
                  onChange={(e) =>
                    updateGroup(group.id, { pasteBuffer: e.target.value })
                  }
                  rows={3}
                  placeholder={`KV-001\t9x5 cm\t500\t₺420,00\nKV-002\t9x5 cm\t1000\t₺620,00`}
                  className="flex-1 text-xs font-mono border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#0f75bc] resize-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => parsePaste(group.id)}
                  disabled={!group.pasteBuffer.trim()}
                  className="self-end text-xs font-bold bg-[#0f75bc] disabled:opacity-40 text-white px-3 py-2 rounded-lg hover:bg-[#07446c] transition-colors"
                >
                  Uygula
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addGroup}
          className="w-full border-2 border-dashed border-blue-200 text-[#0f75bc] font-bold py-3 rounded-2xl hover:bg-blue-50 transition-colors text-sm"
        >
          + Grup Ekle
        </button>
      </div>
    </div>
  );
}
