"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase, type AmbalajCategory, type AmbalajProduct } from "@/lib/supabase";
import {
  Plus, Trash2, LogOut, Loader2, CheckCircle, AlertCircle,
  ImageIcon, Upload, Pencil, X, Package, Tag, Ruler,
} from "lucide-react";
import AdminGuard from "@/app/admin/_components/AdminGuard";

/* ─── Helpers ──────────────────────────────────────────── */
const toSlug = (s: string) =>
  s.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {msg}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all";

const emptyCatForm  = () => ({ name: "", slug: "", icon: "📦", order_index: 0 });
const emptyProdForm = () => ({ category_id: "", name: "", description: "", features: "", width: "", height: "", depth: "" });

/* ─── Guard wrapper ─────────────────────────────────────── */
export default function AmbalajYonetimi() {
  return <AdminGuard><AmbalajYonetimiInner /></AdminGuard>;
}

/* ─── Main ──────────────────────────────────────────────── */
function AmbalajYonetimiInner() {
  /* — Data — */
  const [categories, setCategories] = useState<AmbalajCategory[]>([]);
  const [products,   setProducts]   = useState<AmbalajProduct[]>([]);
  const [loadingCats,  setLoadingCats]  = useState(false);
  const [loadingProds, setLoadingProds] = useState(false);
  const [filterCatId, setFilterCatId]  = useState<string>("all");

  /* — Category form — */
  const [catForm,   setCatForm]   = useState(emptyCatForm());
  const [catEditId, setCatEditId] = useState<string | null>(null);
  const [savingCat, setSavingCat] = useState(false);

  /* — Product form — */
  const [prodForm,   setProdForm]   = useState(emptyProdForm());
  const [prodEditId, setProdEditId] = useState<string | null>(null);
  const [savingProd, setSavingProd] = useState(false);
  const [imageFile,  setImageFile]  = useState<{ file: File; preview: string } | null>(null);
  const [existingImg, setExistingImg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /* — Toast — */
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => { sessionStorage.removeItem("kmp_admin"); window.location.href = "/admin/login"; };

  /* ── Fetch ───────────────────────────────────────────── */
  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const { data } = await supabase
        .from("ambalaj_categories")
        .select("*")
        .order("order_index", { ascending: true });
      setCategories((data as AmbalajCategory[]) ?? []);
    } catch { setCategories([]); }
    finally { setLoadingCats(false); }
  };

  const fetchProducts = async () => {
    setLoadingProds(true);
    try {
      const { data } = await supabase
        .from("ambalaj_products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts((data as AmbalajProduct[]) ?? []);
    } catch { setProducts([]); }
    finally { setLoadingProds(false); }
  };

  useEffect(() => { fetchCategories(); fetchProducts(); }, []);

  /* Auto-slug */
  useEffect(() => {
    if (!catEditId) setCatForm(f => ({ ...f, slug: toSlug(f.name) }));
  }, [catForm.name, catEditId]);

  /* Filtered products */
  const filteredProducts = filterCatId === "all"
    ? products
    : products.filter(p => p.category_id === filterCatId);

  const getCatLabel = (id: string) => {
    const c = categories.find(x => x.id === id);
    return c ? `${c.icon} ${c.name}` : "—";
  };

  /* ══════════════════════════════════════════════════════
     CATEGORY CRUD
  ══════════════════════════════════════════════════════ */
  const resetCatForm = () => { setCatForm(emptyCatForm()); setCatEditId(null); };

  const startEditCat = (cat: AmbalajCategory) => {
    setCatEditId(cat.id);
    setCatForm({ name: cat.name, slug: cat.slug, icon: cat.icon, order_index: cat.order_index });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveCat = async () => {
    if (!catForm.name.trim()) return showToast("Kategori adı zorunludur.", "error");
    setSavingCat(true);
    const payload = {
      name:        catForm.name.trim(),
      slug:        catForm.slug.trim() || toSlug(catForm.name),
      icon:        catForm.icon.trim() || "📦",
      order_index: Number(catForm.order_index),
    };
    const { error } = catEditId
      ? await supabase.from("ambalaj_categories").update(payload).eq("id", catEditId)
      : await supabase.from("ambalaj_categories").insert(payload);
    setSavingCat(false);
    if (error) return showToast("Hata: " + error.message, "error");
    showToast(catEditId ? "Kategori güncellendi!" : "Kategori eklendi!", "success");
    resetCatForm();
    fetchCategories();
  };

  const handleDeleteCat = async (cat: AmbalajCategory) => {
    if (!confirm(`"${cat.name}" kategorisi ve içindeki tüm ürünler silinsin mi?`)) return;
    await supabase.from("ambalaj_products").delete().eq("category_id", cat.id);
    const { error } = await supabase.from("ambalaj_categories").delete().eq("id", cat.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");
    showToast("Kategori silindi.", "success");
    if (filterCatId === cat.id) setFilterCatId("all");
    fetchCategories();
    fetchProducts();
  };

  /* ══════════════════════════════════════════════════════
     PRODUCT CRUD
  ══════════════════════════════════════════════════════ */
  const resetProdForm = () => {
    setProdForm(emptyProdForm());
    setProdEditId(null);
    setImageFile(null);
    setExistingImg("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEditProd = (p: AmbalajProduct) => {
    setProdEditId(p.id);
    setProdForm({
      category_id: p.category_id,
      name:        p.name,
      description: p.description ?? "",
      features:    p.features    ?? "",
      width:       p.width       ?? "",
      height:      p.height      ?? "",
      depth:       p.depth       ?? "",
    });
    setExistingImg(p.image_url ?? "");
    setImageFile(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile({ file, preview: URL.createObjectURL(file) });
    if (fileRef.current) fileRef.current.value = "";
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext  = file.name.split(".").pop();
    const path = `ambalaj/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) { showToast("Görsel yüklenemedi: " + error.message, "error"); return null; }
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  };

  const handleSaveProd = async () => {
    if (!prodForm.name.trim())      return showToast("Ürün adı zorunludur.", "error");
    if (!prodForm.category_id)      return showToast("Kategori seçiniz.", "error");
    setSavingProd(true);

    let imageUrl = existingImg;
    if (imageFile) {
      const url = await uploadImage(imageFile.file);
      if (!url) { setSavingProd(false); return; }
      imageUrl = url;
    }

    const payload: Record<string, unknown> = {
      category_id: prodForm.category_id,
      name:        prodForm.name.trim(),
      description: prodForm.description.trim(),
      features:    prodForm.features.trim(),
      width:       prodForm.width.trim(),
      height:      prodForm.height.trim(),
      depth:       prodForm.depth.trim(),
      image_url:   imageUrl,
    };

    const { error } = prodEditId
      ? await supabase.from("ambalaj_products").update(payload).eq("id", prodEditId)
      : await supabase.from("ambalaj_products").insert(payload);

    setSavingProd(false);
    if (error) return showToast("Hata: " + error.message, "error");
    showToast(prodEditId ? "Ürün güncellendi!" : "Ürün eklendi!", "success");
    resetProdForm();
    fetchProducts();
  };

  const handleDeleteProd = async (p: AmbalajProduct) => {
    if (!confirm(`"${p.name}" silinsin mi?`)) return;
    const { error } = await supabase.from("ambalaj_products").delete().eq("id", p.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");
    showToast("Ürün silindi.", "success");
    fetchProducts();
  };

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Header ── */}
      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-black text-lg">KMP<span className="text-[#25aae1]">BASKI</span> — Ambalaj Yönetimi</h1>
          <p className="text-blue-200 text-xs mt-0.5">Ambalaj kategorileri ve ürünlerini yönet</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a href="/admin/urun-yonetimi"    className="text-xs text-blue-300 hover:text-white transition-colors">Ürün Yönetimi →</a>
          <a href="/admin/kategori-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">Kategori Yönetimi →</a>
          <a href="/admin/banner-yonetimi"  className="text-xs text-blue-300 hover:text-white transition-colors">Banner Yönetimi →</a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <LogOut size={15} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ══════════════════════════════════════════════
            KATEGORİLER
        ══════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              <Tag size={18} className="text-[#0f75bc]" /> Ambalaj Kategorileri
            </h2>
            {!loadingCats && (
              <span className="text-xs bg-[#0f75bc]/10 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">
                {categories.length} kategori
              </span>
            )}
          </div>

          {/* Liste */}
          {loadingCats ? (
            <div className="flex items-center justify-center py-8 text-slate-300"><Loader2 size={24} className="animate-spin" /></div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-slate-300">
              <Tag size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Henüz kategori eklenmemiş.</p>
            </div>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-50">
                    {["İkon", "Kategori Adı", "Slug", "Sıra", ""].map((h, i) => (
                      <th key={i} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-blue-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 text-2xl">{cat.icon}</td>
                      <td className="py-3 pr-4 font-semibold text-[#07446c]">{cat.name}</td>
                      <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs bg-blue-50 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">{cat.order_index}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditCat(cat)}
                            className="p-2 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDeleteCat(cat)}
                            className="p-2 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Kategori formu */}
          <div className="border-t border-blue-50 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-[#07446c] flex items-center gap-2">
                {catEditId ? <Pencil size={15} className="text-[#0f75bc]" /> : <Plus size={15} className="text-[#0f75bc]" />}
                {catEditId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
              </h3>
              {catEditId && (
                <button onClick={resetCatForm} className="text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors">✕ İptal</button>
              )}
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <Field label="Kategori Adı *">
                <input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ör: Baklava Kutuları" className={inputCls} />
              </Field>
              <Field label="Slug">
                <input value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="baklava-kutulari" className={`${inputCls} font-mono text-xs`} />
              </Field>
              <Field label="İkon (emoji)">
                <input value={catForm.icon} onChange={e => setCatForm(f => ({ ...f, icon: e.target.value }))}
                  placeholder="📦" maxLength={4} className={`${inputCls} text-center text-xl`} />
              </Field>
              <Field label="Sıra No">
                <input type="number" min={0} value={catForm.order_index}
                  onChange={e => setCatForm(f => ({ ...f, order_index: Number(e.target.value) }))}
                  className={inputCls} />
              </Field>
            </div>

            <button onClick={handleSaveCat} disabled={savingCat}
              className="mt-4 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-2xl transition-colors shadow-md text-sm">
              {savingCat ? <Loader2 size={15} className="animate-spin" /> : catEditId ? <Pencil size={15} /> : <Plus size={15} />}
              {savingCat ? "Kaydediliyor…" : catEditId ? "Güncelle" : "Kategori Ekle"}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            ÜRÜNLER
        ══════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              <Package size={18} className="text-[#0f75bc]" /> Ambalaj Ürünleri
            </h2>
            <div className="flex items-center gap-3">
              {!loadingProds && (
                <span className="text-xs bg-[#0f75bc]/10 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">
                  {filteredProducts.length} ürün
                </span>
              )}
              <select value={filterCatId} onChange={e => setFilterCatId(e.target.value)}
                className="text-xs border border-blue-100 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] text-[#07446c] font-semibold bg-white">
                <option value="all">Tüm Kategoriler</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Ürün listesi */}
          {loadingProds ? (
            <div className="flex items-center justify-center py-8 text-slate-300"><Loader2 size={24} className="animate-spin" /></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-300">
              <Package size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Bu kategoride henüz ürün yok.</p>
            </div>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-50">
                    {["Görsel", "Ürün Adı", "Kategori", "Ebatlar (E×B×Y cm)", ""].map((h, i) => (
                      <th key={i} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b border-blue-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] relative flex-shrink-0">
                          {p.image_url ? (
                            <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={14} className="text-[#0f75bc]/40" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#07446c] max-w-[200px] truncate">{p.name}</td>
                      <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{getCatLabel(p.category_id)}</td>
                      <td className="py-3 pr-4">
                        {p.width || p.height || p.depth ? (
                          <span className="flex items-center gap-1 text-xs font-mono text-[#07446c] bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                            <Ruler size={10} className="shrink-0" />
                            {[p.width, p.height, p.depth].filter(Boolean).join(" × ")}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditProd(p)}
                            className="p-2 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDeleteProd(p)}
                            className="p-2 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ürün formu */}
          <div className="border-t border-blue-50 pt-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-[#07446c] flex items-center gap-2">
                {prodEditId ? <Pencil size={15} className="text-[#0f75bc]" /> : <Plus size={15} className="text-[#0f75bc]" />}
                {prodEditId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              {prodEditId && (
                <button onClick={resetProdForm} className="text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors">✕ İptal</button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sol — metin alanları */}
              <div className="space-y-4">
                <Field label="Kategori *">
                  <select value={prodForm.category_id}
                    onChange={e => setProdForm(f => ({ ...f, category_id: e.target.value }))}
                    className={inputCls}>
                    <option value="">— Kategori Seç —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </Field>

                <Field label="Ürün Adı *">
                  <input value={prodForm.name} onChange={e => setProdForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ör: Çiğ Köfte Kutusu 1 Kg" className={inputCls} />
                </Field>

                <Field label="Açıklama">
                  <textarea value={prodForm.description} onChange={e => setProdForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="Kısa ürün açıklaması…" className={`${inputCls} resize-none`} />
                </Field>

                <Field label="Özellikler (her satır ayrı madde)">
                  <textarea value={prodForm.features} onChange={e => setProdForm(f => ({ ...f, features: e.target.value }))}
                    rows={4} placeholder={"Gıda onaylı malzeme\n4 renk baskı\nPencereli kapak\nSterilize"} className={`${inputCls} resize-none`} />
                </Field>

                {/* Ebatlar */}
                <div>
                  <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Ruler size={12} /> Varsayılan Ebatlar (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input value={prodForm.width} onChange={e => setProdForm(f => ({ ...f, width: e.target.value }))}
                        placeholder="En" className={inputCls} />
                      <p className="text-[10px] text-gray-400 mt-1 text-center">En</p>
                    </div>
                    <div>
                      <input value={prodForm.height} onChange={e => setProdForm(f => ({ ...f, height: e.target.value }))}
                        placeholder="Boy" className={inputCls} />
                      <p className="text-[10px] text-gray-400 mt-1 text-center">Boy</p>
                    </div>
                    <div>
                      <input value={prodForm.depth} onChange={e => setProdForm(f => ({ ...f, depth: e.target.value }))}
                        placeholder="Yük." className={inputCls} />
                      <p className="text-[10px] text-gray-400 mt-1 text-center">Yükseklik</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sağ — görsel */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[#07446c] uppercase tracking-wide">Ürün Görseli</label>

                {existingImg || imageFile ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-blue-100 bg-gray-50 group">
                    <Image
                      src={imageFile?.preview ?? existingImg}
                      alt="Ürün görseli"
                      fill
                      className="object-contain p-2"
                    />
                    <button type="button"
                      onClick={() => { setImageFile(null); setExistingImg(""); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={13} />
                    </button>
                    <label htmlFor="ambalaj-img-upload"
                      className="absolute bottom-2 right-2 flex items-center gap-1 text-xs font-bold bg-[#0f75bc] text-white px-3 py-1 rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={11} /> Değiştir
                    </label>
                  </div>
                ) : (
                  <label htmlFor="ambalaj-img-upload"
                    className="border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#0f75bc] hover:bg-blue-50 transition-all min-h-[180px]">
                    <Upload size={28} className="text-blue-200" />
                    <p className="text-sm text-slate-400 font-medium">Görsel eklemek için tıklayın</p>
                    <p className="text-xs text-slate-300">PNG, JPG, WEBP</p>
                  </label>
                )}
                <input id="ambalaj-img-upload" type="file" accept="image/*" className="hidden" ref={fileRef} onChange={onFileChange} />
                <p className="text-xs text-gray-400">Görsel Supabase Storage&apos;a yüklenir (product-images bucket).</p>
              </div>
            </div>

            <button onClick={handleSaveProd} disabled={savingProd}
              className="mt-6 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md">
              {savingProd ? <Loader2 size={16} className="animate-spin" /> : prodEditId ? <Pencil size={16} /> : <Plus size={16} />}
              {savingProd ? "Kaydediliyor…" : prodEditId ? "Güncelle" : "Ürünü Kaydet"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
