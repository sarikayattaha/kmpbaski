import type { PriceMatrix } from "@/lib/supabase";

/* ─── Tek tablo bloğu ─── */
function MatrixBlock({
  columns,
  groups,
}: {
  columns: string[];
  groups: PriceMatrix["groups"];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: "#e30613" }}>
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-white font-bold px-4 py-3 text-left border-r border-red-800 last:border-r-0 whitespace-nowrap uppercase tracking-wide text-xs"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group, gi) => (
            <>
              {/* Grup başlık satırı */}
              <tr key={`g-${gi}`}>
                <td
                  colSpan={columns.length}
                  className="font-bold text-white px-4 py-2 text-sm"
                  style={{ backgroundColor: group.color }}
                >
                  {group.label}
                </td>
              </tr>

              {/* Grup satırları — zebra */}
              {group.rows.map((row, ri) => (
                <tr
                  key={`r-${gi}-${ri}`}
                  className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {columns.map((_, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-2 border-b border-gray-100 border-r border-gray-100 last:border-r-0 text-gray-700"
                    >
                      {row[ci] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Uyarı bölümü ─── */
function Disclaimer() {
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">
      <span className="text-red-600 font-black text-xl leading-none shrink-0">!</span>
      <p className="text-sm font-bold text-red-600 leading-relaxed">
        Lütfen Dikkat: Siparişlerinizin Renk, Adet ve Ölçülerinde %1 ila %5
        Arasında Fire Olabilmektedir.
      </p>
    </div>
  );
}

/* ─── Ana bileşen — otomatik 1 veya 2 blok ─── */
export default function ProductTable({ matrix }: { matrix: PriceMatrix }) {
  const totalRows = matrix.groups.reduce((s, g) => s + g.rows.length, 0);
  const splitInTwo = totalRows > 12 && matrix.groups.length >= 4;

  if (splitInTwo) {
    const mid = Math.ceil(matrix.groups.length / 2);
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MatrixBlock columns={matrix.columns} groups={matrix.groups.slice(0, mid)} />
          <MatrixBlock columns={matrix.columns} groups={matrix.groups.slice(mid)} />
        </div>
        <Disclaimer />
      </>
    );
  }

  return (
    <>
      <MatrixBlock columns={matrix.columns} groups={matrix.groups} />
      <Disclaimer />
    </>
  );
}
