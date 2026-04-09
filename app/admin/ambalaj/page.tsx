"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase, type AmbalajCategory, type AmbalajProduct } from "@/lib/supabase";
import {
  Plus, Trash2, LogOut, Loader2, CheckCircle, AlertCircle,
  ImageIcon, Upload, Pencil, X, Package, Tag,
} from "lucide-react";
import AdminGuard from "@/app/admin/_components/AdminGuard";

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
const emptyCat  = () => ({ name: "", slug: "", order_index: 0 });
const emptyProd = () => ({ category_id: "", name: "", description: "" });

export default function AmbalajYonetimi() {
  return <AdminGuard><AmbalajYonetimiInner /></AdminGuard>;
}

function AmbalajYonetimiInner() {
  const [categories, setCategories] = useState<AmbalajCategory[]>([]);
  const [products,   setProducts]   = useState<AmbalajProduct[]>([]);
  const [loadingCats,  setLoadingCats]  = useState(false);
  const [loadingProds, setLoadingProds] = useState(false);
  const [filterCatId,  setFilterCatId]  = useState("all");

  /* Category form */
  const [catForm,       setCatForm]       = useState(emptyCat());
  const [catEditId,     setCatEditId]     = useState<string | null>(null);
  const [savingCat,     setSavingCat]     = useState(false);
  const [catImgFile,    setCatImgFile]    = useState<{ file: File; preview: string } | null>(null);
  const [catImgExist,   setCatImgExist]   = useState("");
  const catFileRef = useRef<HTMLInputElement>(null);

  /* Product form */
  const [prodForm,      setProdForm]      = useState(emptyProd());
  const [prodEditId,    setProdEditId]    = useState<string | null>(null);
  const [savingProd,    setSavingProd]    = useState(false);
  const [prodImgFile,   setProdImgFile]   = useState<{ file: File; preview: string } | null>(null);
  const [prodImgExist,  setProdImgExist]  = useState("");
  const prodFileRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  const handleLogout = () => { sessionStorage.removeItem("kmp_admin"); window.location.href = "/admin/login"; };

  /* ── Fetch ── */
  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const { data } = await supabase.from("ambalaj_categories").select("*").order("order_index", { ascending: true });
      setCategories((data as AmbalajCategory[]) ?? []);
    } catch { setCategories([]); } finally { setLoadingCats(false); }
  };
  const fetchProducts = async () => {
    setLoadingProds(true);
    try {
      const { data } = await supabase.from("ambalaj_products").select("*").order("created_at", { ascending: false });
      setProducts((data as AmbalajProduct[]) ?? []);
    } catch { setProducts([]); } finally { setLoadingProds(false); }
  };
  useEffect(() => { fetchCategories(); fetchProducts(); }, []);
  useEffect(() => { if (!catEditId) setCatForm(f => ({ ...f, slug: toSlug(f.name) })); }, [catForm.name, catEditId]);

  const filteredProducts = filterCatId === "all" ? products : products.filter(p => p.category_id === filterCatId);

  /* ── Upload helper ── */
  const uploadFile = async (file: File, prefix: string): Promise<string | null> => {
    const ext  = file.name.split(".").pop();
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) { showToast("Görsel yüklenemedi: " + error.message, "error"); return null; }
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  };

  /* ══ CATEGORY CRUD ══ */
  const resetCat = () => { setCatForm(emptyCat()); setCatEditId(null); setCatImgFile(null); setCatImgExist(""); if (catFileRef.current) catFileRef.current.value = ""; };

  const startEditCat = (c: AmbalajCategory) => {
    setCatEditId(c.id);
    setCatForm({ name: c.name, slug: c.slug, order_index: c.order_index });
    setCatImgExist(c.cover_image ?? "");
    setCatImgFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveCat = async () => {
    if (!catForm.name.trim()) return showToast("Kategori adı zorunludur.", "error");
    setSavingCat(true);
    let cover_image = catImgExist;
    if (catImgFile) {
      const url = await uploadFile(catImgFile.file, "ambalaj-cats");
      if (!url) { setSavingCat(false); return; }
      cover_image = url;
    }
    const payload = { name: catForm.name.trim(), slug: catForm.slug.trim() || toSlug(catForm.name), cover_image, order_index: Number(catForm.order_index) };
    const { error } = catEditId
      ? await supabase.from("ambalaj_categories").update(payload).eq("id", catEditId)
      : await supabase.from("ambalaj_categories").insert(payload);
    setSavingCat(false);
    if (error) return showToast("Hata: " + error.message, "error");
    showToast(catEditId ? "Kategori güncellendi!" : "Kategori eklendi!", "success");
    resetCat(); fetchCategories();
  };

  const handleDeleteCat = async (c: AmbalajCategory) => {
    if (!confirm(`"${c.name}" ve içindeki ürünler silinsin mi?`)) return;
    await supabase.from("ambalaj_products").delete().eq("category_id", c.id);
    const { error } = await supabase.from("ambalaj_categories").delete().eq("id", c.id);
    if (error) return showToast("Hata: " + error.message, "error");
    showToast("Kategori silindi.", "success");
    if (filterCatId === c.id) setFilterCatId("all");
    fetchCategories(); fetchProducts();
  };

  /* ══ PRODUCT CRUD ══ */
  const resetProd = () => { setProdForm(emptyProd()); setProdEditId(null); setProdImgFile(null); setProdImgExist(""); if (prodFileRef.current) prodFileRef.current.value = ""; };

  const startEditProd = (p: AmbalajProduct) => {
    setProdEditId(p.id);
    setProdForm({ category_id: p.category_id, name: p.name, description: p.description ?? "" });
    setProdImgExist(p.image_url ?? "");
    setProdImgFile(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleSaveProd = async () => {
    if (!prodForm.name.trim())    return showToast("Ürün adı zorunludur.", "error");
    if (!prodForm.category_id)    return showToast("Kategori seçiniz.", "error");
    setSavingProd(true);
    let image_url = prodImgExist;
    if (prodImgFile) {
      const url = await uploadFile(prodImgFile.file, "ambalaj");
      if (!url) { setSavingProd(false); return; }
      image_url = url;
    }
    const payload = { category_id: prodForm.category_id, name: prodForm.name.trim(), description: prodForm.description.trim(), image_url };
    const { error } = prodEditId
      ? await supabase.from("ambalaj_products").update(payload).eq("id", prodEditId)
      : await supabase.from("ambalaj_products").insert(payload);
    setSavingProd(false);
    if (error) return showToast("Hata: " + error.message, "error");
    showToast(prodEditId ? "Ürün güncellendi!" : "Ürün eklendi!", "success");
    resetProd(); fetchProducts();
  };

  const handleDeleteProd = async (p: AmbalajProduct) => {
    if (!confirm(`"${p.name}" silinsin mi?`)) return;
    const { error } = await supabase.from("ambalaj_products").delete().eq("id", p.id);
    if (error) return showToast("Hata: " + error.message, "error");
    showToast("Ürün silindi.", "success"); fetchProducts();
  };

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name ?? "—";

  /* ── Image picker (reusable render) ── */
  const ImagePicker = ({
    id, existingUrl, newFile,
    onFileChange, onRemove,
  }: {
    id: string;
    existingUrl: string;
    newFile: { file: File; preview: string } | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
  }) => {
    const src = newFile?.preview ?? existingUrl;
    return src ? (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-blue-100 bg-gray-50 group">
        <Image src={src} alt="görsel" fill className="object-contain p-2" />
        <button type="button" onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <X size={13} />
        </button>
        <label htmlFor={id}
          className="absolute bottom-2 right-2 flex items-center gap-1 text-xs font-bold bg-[#0f75bc] text-white px-3 py-1 rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload size={11} /> Değiştir
        </label>
        <input id={id} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </div>
    ) : (
      <label htmlFor={id}
        className="border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#0f75bc] hover:bg-blue-50 transition-all min-h-[150px]">
        <Upload size={26} className="text-blue-200" />
        <p className="text-sm text-slate-400 font-medium">Görsel eklemek için tıklayın</p>
        <input id={id} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-black text-lg">KMP<span className="text-[#25aae1]">BASKI</span> — Ambalaj Yönetimi</h1>
          <p className="text-blue-200 text-xs mt-0.5">Ambalaj kategorileri ve ürünlerini yönet</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a href="/admin/urun-yonetimi"     className="text-xs text-blue-300 hover:text-white transition-colors">Ürün Yönetimi →</a>
          <a href="/admin/kategori-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">Kategori Yönetimi →</a>
          <a href="/admin/banner-yonetimi"   className="text-xs text-blue-300 hover:text-white transition-colors">Banner Yönetimi →</a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <LogOut size={15} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ══ KATEGORİLER ══ */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              <Tag size={18} className="text-[#0f75bc]" /> Ambalaj Kategorileri
            </h2>
            {!loadingCats && (
              <span className="text-xs bg-[#0f75bc]/10 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">{categories.length} kategori</span>
            )}
          </div>

          {loadingCats ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-slate-300" /></div>
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
                    {["Görsel", "Kategori Adı", "Slug", "Sıra", ""].map((h, i) => (
                      <th key={i} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-b border-blue-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] relative flex-shrink-0">
                          {cat.cover_image
                            ? <Image src={cat.cover_image} alt={cat.name} fill className="object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-[#0f75bc]/40" /></div>}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#07446c]">{cat.name}</td>
                      <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs bg-blue-50 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">{cat.order_index}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditCat(cat)} className="p-2 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteCat(cat)} className="p-2 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
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
              {catEditId && <button onClick={resetCat} className="text-xs text-gray-400 hover:text-red-500 font-semibold">✕ İptal</button>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Field label="Kategori Adı *">
                  <input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ör: Pastane Ürünleri" className={inputCls} />
                </Field>
                <Field label="Slug">
                  <input value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="pastane-urunleri" className={`${inputCls} font-mono text-xs`} />
                </Field>
                <Field label="Sıra No">
                  <input type="number" min={0} value={catForm.order_index}
                    onChange={e => setCatForm(f => ({ ...f, order_index: Number(e.target.value) }))}
                    className={inputCls} />
                </Field>
              </div>
              <div>
                <Field label="Kapak Görseli">
                  <ImagePicker
                    id="cat-img"
                    existingUrl={catImgExist}
                    newFile={catImgFile}
                    onFileChange={e => { const f = e.target.files?.[0]; if (f) setCatImgFile({ file: f, preview: URL.createObjectURL(f) }); if (catFileRef.current) catFileRef.current.value = ""; }}
                    onRemove={() => { setCatImgFile(null); setCatImgExist(""); }}
                  />
                </Field>
              </div>
            </div>

            <button onClick={handleSaveCat} disabled={savingCat}
              className="mt-4 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-2xl transition-colors shadow-md text-sm">
              {savingCat ? <Loader2 size={15} className="animate-spin" /> : catEditId ? <Pencil size={15} /> : <Plus size={15} />}
              {savingCat ? "Kaydediliyor…" : catEditId ? "Güncelle" : "Kategori Ekle"}
            </button>
          </div>
        </div>

        {/* ══ ÜRÜNLER ══ */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              <Package size={18} className="text-[#0f75bc]" /> Ambalaj Ürünleri
            </h2>
            <div className="flex items-center gap-3">
              {!loadingProds && (
                <span className="text-xs bg-[#0f75bc]/10 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">{filteredProducts.length} ürün</span>
              )}
              <select value={filterCatId} onChange={e => setFilterCatId(e.target.value)}
                className="text-xs border border-blue-100 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] text-[#07446c] font-semibold bg-white">
                <option value="all">Tüm Kategoriler</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {loadingProds ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-slate-300" /></div>
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
                    {["Görsel", "Ürün Adı", "Kategori", ""].map((h, i) => (
                      <th key={i} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-blue-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] relative flex-shrink-0">
                          {p.image_url
                            ? <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-[#0f75bc]/40" /></div>}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#07446c] max-w-[220px] truncate">{p.name}</td>
                      <td className="py-3 pr-4 text-gray-500">{getCatName(p.category_id)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditProd(p)} className="p-2 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteProd(p)} className="p-2 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
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
              {prodEditId && <button onClick={resetProd} className="text-xs text-gray-400 hover:text-red-500 font-semibold">✕ İptal</button>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Field label="Kategori *">
                  <select value={prodForm.category_id} onChange={e => setProdForm(f => ({ ...f, category_id: e.target.value }))} className={inputCls}>
                    <option value="">— Kategori Seç —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Ürün Adı *">
                  <input value={prodForm.name} onChange={e => setProdForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ör: Çiğ Köfte Kutusu 1 Kg" className={inputCls} />
                </Field>
                <Field label="Açıklama">
                  <textarea value={prodForm.description} onChange={e => setProdForm(f => ({ ...f, description: e.target.value }))}
                    rows={4} placeholder="Kısa ürün açıklaması…" className={`${inputCls} resize-none`} />
                </Field>
              </div>
              <div>
                <Field label="Ürün Görseli">
                  <ImagePicker
                    id="prod-img"
                    existingUrl={prodImgExist}
                    newFile={prodImgFile}
                    onFileChange={e => { const f = e.target.files?.[0]; if (f) setProdImgFile({ file: f, preview: URL.createObjectURL(f) }); if (prodFileRef.current) prodFileRef.current.value = ""; }}
                    onRemove={() => { setProdImgFile(null); setProdImgExist(""); }}
                  />
                </Field>
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
