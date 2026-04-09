"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase, type Product } from "@/lib/supabase";
import {
  Plus, Trash2, LogOut, Loader2, CheckCircle,
  AlertCircle, ImageIcon, Star, Upload, ExternalLink, Pencil, MessageSquare,
} from "lucide-react";
import { type Review } from "@/lib/supabase";
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

/* Boş form state */
const emptyForm = () => ({
  name: "", slug: "", price: "", features: "", category: "", isFeatured: false, isPriceOnRequest: false,
});

const emptyReview = (): Review => ({ name: "", rating: 5, date: "", comment: "" });

export default function UrunYonetimi() {
  return <AdminGuard><UrunYonetimiInner /></AdminGuard>;
}

function UrunYonetimiInner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);

  const [form, setForm]   = useState(emptyForm());
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editId, setEditId] = useState<string | null>(null); // null = yeni ekle, string = düzenle
  const [file, setFile]   = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => { sessionStorage.removeItem("kmp_admin"); window.location.href = "/admin/login"; };

  /* ── Ürünleri yükle ── */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts((data as Product[]) ?? []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProducts(); }, []);

  /* ── Slug otomatik ── */
  useEffect(() => {
    if (!editId) setForm((f) => ({ ...f, slug: toSlug(f.name) }));
  }, [form.name, editId]);

  /* ── Dosya seç ── */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ── Formu sıfırla ── */
  const resetForm = () => {
    setForm(emptyForm());
    setReviews([]);
    setEditId(null);
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Düzenlemeye aç ── */
  const startEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, slug: p.slug, price: p.price ?? "", features: p.features ?? "", category: p.category, isFeatured: p.is_featured, isPriceOnRequest: p.is_price_on_request ?? false });
    setReviews(Array.isArray(p.reviews) ? p.reviews : []);
    setPreview(p.image_url || null);
    setFile(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  /* ── Görsel yükle (ortak) ── */
  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null;
    const ext  = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) { showToast("Görsel yüklenemedi: " + error.message, "error"); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  /* ── Ürün ekle / güncelle ── */
  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Ürün adı zorunludur.", "error");
    if (!form.slug.trim()) return showToast("Slug zorunludur.", "error");
    setSaving(true);

    let imageUrl: string | undefined;
    if (file) {
      const url = await uploadImage();
      if (!url) { setSaving(false); return; }
      imageUrl = url;
    }

    const payload: Record<string, unknown> = {
      name:                 form.name.trim(),
      slug:                 form.slug.trim(),
      price:                form.isPriceOnRequest ? "" : form.price.trim(),
      features:             form.features.trim(),
      category:             form.category,
      is_featured:          form.isFeatured,
      is_price_on_request:  form.isPriceOnRequest,
      reviews:              reviews.filter(r => r.name.trim() && r.comment.trim()),
    };
    if (imageUrl) payload.image_url = imageUrl;

    const { error } = editId
      ? await supabase.from("products").update(payload).eq("id", editId)
      : await supabase.from("products").insert({ ...payload, image_url: imageUrl ?? "" });

    setSaving(false);
    if (error) return showToast("Hata: " + error.message, "error");

    showToast(editId ? "Ürün güncellendi!" : "Ürün eklendi!", "success");
    resetForm();
    fetchProducts();
  };

  /* ── Ürün sil ── */
  const handleDelete = async (p: Product) => {
    if (!confirm(`"${p.name}" silinsin mi?`)) return;
    if (p.image_url) {
      const path = p.image_url.split("/").pop();
      if (path) await supabase.storage.from("product-images").remove([path]);
    }
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");
    showToast("Ürün silindi.", "success");
    fetchProducts();
  };

  /* ════════════ PANEL ════════════ */
  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg">KMP<span className="text-[#25aae1]">BASKI</span> — Ürün Yönetimi</h1>
          <p className="text-blue-200 text-xs mt-0.5">Ürün ekle, düzenle ve sil</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/banner-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">
            Banner Yönetimi →
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <LogOut size={15} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── MEVCUT ÜRÜNLER ── */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              <ImageIcon size={18} className="text-[#0f75bc]" /> Mevcut Ürünler
            </h2>
            {!loading && (
              <span className="text-xs bg-[#0f75bc]/10 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">
                {products.length} ürün
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-300">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-slate-300">
              <ImageIcon size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Henüz ürün eklenmemiş.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-50">
                    {["Görsel", "Ürün Adı", "Kategori", "Fiyat", "Slug", "Öne Çıkan", ""].map((h, i) => (
                      <th key={i} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
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
                      <td className="py-3 pr-4 font-semibold text-[#07446c] max-w-[180px] truncate">{p.name}</td>
                      <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{p.category}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {p.is_price_on_request
                          ? <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Fiyat Alınız</span>
                          : <span className="font-bold text-[#07446c]">{p.price || "—"}</span>
                        }
                      </td>
                      <td className="py-3 pr-4">
                        <a href={`/urun/${p.slug}`} target="_blank"
                          className="flex items-center gap-1 text-[#0f75bc] hover:underline text-xs font-mono">
                          {p.slug} <ExternalLink size={11} />
                        </a>
                      </td>
                      <td className="py-3 pr-4">
                        {p.is_featured ? <Star size={15} className="text-amber-400 fill-amber-400" /> : <span className="text-gray-200">—</span>}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(p)}
                            className="p-2 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p)}
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
        </div>

        {/* ── YENİ ÜRÜN EKLE / DÜZENLE ── */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              {editId ? <Pencil size={18} className="text-[#0f75bc]" /> : <Plus size={18} className="text-[#0f75bc]" />}
              {editId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>
            {editId && (
              <button onClick={resetForm} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-semibold">
                ✕ İptal
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sol: metin alanları */}
            <div className="space-y-4">
              <Field label="Ürün Adı *">
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ör: NK Standart Kartvizit" className={inputCls} />
              </Field>

              <Field label="Slug (URL) *">
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="nk-standart-kartvizit" className={`${inputCls} font-mono text-xs`} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Field label="Fiyat">
                    <input
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      placeholder="Ör: ₺120"
                      disabled={form.isPriceOnRequest}
                      className={`${inputCls} ${form.isPriceOnRequest ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}`}
                    />
                  </Field>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={form.isPriceOnRequest}
                      onChange={(e) => setForm((f) => ({ ...f, isPriceOnRequest: e.target.checked, price: e.target.checked ? "" : f.price }))}
                      className="w-4 h-4 rounded accent-orange-500"
                    />
                    <span className="text-xs font-semibold text-orange-600">Fiyat Alınız yazsın</span>
                  </label>
                </div>
                <Field label="Kategori">
                  <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Ör: Kartvizitler" className={inputCls} />
                </Field>
              </div>

              <Field label="Özellikler (her satır ayrı madde)">
                <textarea value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                  rows={6} placeholder={"90x50 mm ebat\n350 gr kuşe kağıt\nSelofan kaplama\n500 adet"} className={`${inputCls} resize-none`} />
              </Field>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#0f75bc]" />
                <span className="text-sm font-semibold text-[#07446c]">Öne çıkan ürün</span>
              </label>
            </div>

            {/* Sağ: görsel */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-[#07446c] uppercase tracking-wide">Ürün Görseli</label>
              <label htmlFor="product-upload"
                className="flex-1 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#0f75bc] hover:bg-blue-50 transition-all min-h-[220px] relative overflow-hidden">
                {preview ? (
                  <Image src={preview} alt="önizleme" fill className="object-contain p-4" />
                ) : (
                  <>
                    <Upload size={32} className="text-blue-200" />
                    <p className="text-sm text-slate-400 font-medium">Görsel seçmek için tıklayın</p>
                    <p className="text-xs text-slate-300">PNG, JPG, WEBP · Maks 5MB</p>
                  </>
                )}
              </label>
              <input id="product-upload" type="file" accept="image/*" className="hidden" ref={fileRef} onChange={onFileChange} />
              {preview && (
                <button type="button" onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-xs text-red-400 hover:text-red-600 self-start">
                  Görseli kaldır
                </button>
              )}
            </div>
          </div>

          {/* ── YORUMLAR ── */}
          <div className="mt-8 border-t border-blue-50 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-[#07446c] flex items-center gap-2">
                <MessageSquare size={16} className="text-[#0f75bc]" /> Müşteri Yorumları
              </h3>
              <button type="button"
                onClick={() => setReviews(r => [...r, emptyReview()])}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0f75bc] hover:text-[#07446c] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">
                <Plus size={13} /> Yorum Ekle
              </button>
            </div>

            {reviews.length === 0 && (
              <p className="text-xs text-gray-400 italic">Henüz yorum eklenmedi. "Yorum Ekle" butonuna tıklayın.</p>
            )}

            <div className="space-y-4">
              {reviews.map((rev, i) => (
                <div key={i} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 relative">
                  <button type="button" onClick={() => setReviews(r => r.filter((_, idx) => idx !== i))}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-[#07446c] mb-1">İsim</label>
                      <input value={rev.name}
                        onChange={e => setReviews(r => r.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                        placeholder="Ahmet Y." className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#07446c] mb-1">Tarih</label>
                      <input value={rev.date}
                        onChange={e => setReviews(r => r.map((x, idx) => idx === i ? { ...x, date: e.target.value } : x))}
                        placeholder="12 Mart 2025" className={inputCls} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-bold text-[#07446c] mb-1">Puan</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setReviews(r => r.map((x, idx) => idx === i ? { ...x, rating: n } : x))}>
                          <Star size={22} className={n <= rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                        </button>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{rev.rating}/5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#07446c] mb-1">Yorum</label>
                    <textarea value={rev.comment}
                      onChange={e => setReviews(r => r.map((x, idx) => idx === i ? { ...x, comment: e.target.value } : x))}
                      rows={2} placeholder="Baskı kalitesi çok iyiydi…" className={`${inputCls} resize-none`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="mt-6 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md">
            {saving ? <Loader2 size={16} className="animate-spin" /> : editId ? <Pencil size={16} /> : <Plus size={16} />}
            {saving ? "Kaydediliyor…" : editId ? "Güncelle" : "Ürünü Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
