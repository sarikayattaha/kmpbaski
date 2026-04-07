"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase, type Product } from "@/lib/supabase";
import MatrixBuilder, {
  defaultMatrix,
  type MatrixState,
} from "@/app/components/MatrixBuilder";
import {
  Plus,
  Trash2,
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Star,
  Upload,
  ExternalLink,
} from "lucide-react";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "kmpbaski2024";

const CATEGORIES = [
  "Kartvizitler",
  "Broşür & Katalog",
  "Kurumsal Ürünler",
  "Reklam Ürünleri",
  "Ambalaj",
  "Promosyon",
  "Sticker / Etiket",
  "Tabela & Afiş",
  "Diğer",
];

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ── Toast ── */
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {msg}
    </div>
  );
}

/* ── Input helper ── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all";

export default function UrunYonetimi() {
  /* ── Auth ── */
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);

  /* ── Ürün listesi ── */
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  /* ── Form ── */
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<MatrixState>(defaultMatrix);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Toast ── */
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Auth (sessionStorage) ── */
  useEffect(() => {
    if (sessionStorage.getItem("kmp_admin") === "1") setAuthed(true);
  }, []);

  const handleLogin = () => {
    if (pass === ADMIN_KEY) {
      sessionStorage.setItem("kmp_admin", "1");
      setAuthed(true);
    } else {
      setPassErr(true);
      setTimeout(() => setPassErr(false), 1500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kmp_admin");
    setAuthed(false);
  };

  /* ── Ürünleri yükle ── */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts((data as Product[]) ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed]);

  /* ── Slug otomatik ── */
  useEffect(() => {
    setSlug(toSlug(name));
  }, [name]);

  /* ── Dosya seç ── */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ── Formu sıfırla ── */
  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setIsFeatured(false);
    setFile(null);
    setPreview(null);
    setMatrix(defaultMatrix);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Ürün ekle ── */
  const handleAdd = async () => {
    if (!name.trim()) return showToast("Ürün adı zorunludur.", "error");
    if (!slug.trim()) return showToast("Slug zorunludur.", "error");
    setSaving(true);

    let imageUrl = "";

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });
      if (upErr) {
        setSaving(false);
        return showToast("Görsel yüklenemedi: " + upErr.message, "error");
      }
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    // matrix state'inden groups'un pasteBuffer'ını temizle
    const cleanMatrix = {
      columns: matrix.columns,
      groups: matrix.groups.map(({ id: _id, pasteBuffer: _pb, ...rest }) => rest),
    };

    const { error } = await supabase.from("products").insert({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      category,
      image_url: imageUrl,
      price_matrix: cleanMatrix,
      is_featured: isFeatured,
    });

    setSaving(false);
    if (error) return showToast("Kayıt hatası: " + error.message, "error");

    showToast("Ürün başarıyla eklendi!", "success");
    resetForm();
    fetchProducts();
  };

  /* ── Ürün sil ── */
  const handleDelete = async (product: Product) => {
    if (!confirm(`"${product.name}" silinsin mi?`)) return;
    if (product.image_url) {
      const path = product.image_url.split("/").pop();
      if (path) await supabase.storage.from("product-images").remove([path]);
    }
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");
    showToast("Ürün silindi.", "success");
    fetchProducts();
  };

  /* ════════════════════════════
     GİRİŞ EKRANI
  ════════════════════════════ */
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07446c] to-[#0f75bc] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#0f75bc]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={28} className="text-[#0f75bc]" />
            </div>
            <h1 className="text-xl font-black text-[#07446c]">KMP BASKI</h1>
            <p className="text-sm text-slate-400 mt-1">Ürün Yönetimi</p>
          </div>
          <input
            type="password"
            placeholder="Yönetici şifresi"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`w-full border rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all ${
              passErr ? "border-red-400 bg-red-50" : "border-blue-100"
            }`}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Giriş Yap
          </button>
          {passErr && (
            <p className="text-xs text-red-500 text-center mt-2">Hatalı şifre.</p>
          )}
        </div>
      </div>
    );
  }

  /* ════════════════════════════
     ADMIN PANELİ
  ════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg">
            KMP<span className="text-[#25aae1]">BASKI</span> — Ürün Yönetimi
          </h1>
          <p className="text-blue-200 text-xs mt-0.5">
            Ürün ekle, sil ve fiyat matrisi oluştur
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/banner-yonetimi"
            className="text-xs text-blue-300 hover:text-white transition-colors"
          >
            Banner Yönetimi →
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <LogOut size={15} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ── MEVCUT ÜRÜNLER ── */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              <ImageIcon size={18} className="text-[#0f75bc]" />
              Mevcut Ürünler
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
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">
                      Görsel
                    </th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">
                      Ürün
                    </th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">
                      Kategori
                    </th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">
                      Slug
                    </th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">
                      Öne Çıkan
                    </th>
                    <th className="pb-3 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-blue-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] relative flex-shrink-0">
                          {p.image_url ? (
                            <Image
                              src={p.image_url}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={14} className="text-[#0f75bc]/40" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#07446c]">
                        {p.name}
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{p.category}</td>
                      <td className="py-3 pr-4">
                        <a
                          href={`/urun/${p.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 text-[#0f75bc] hover:underline text-xs font-mono"
                        >
                          {p.slug} <ExternalLink size={11} />
                        </a>
                      </td>
                      <td className="py-3 pr-4">
                        {p.is_featured ? (
                          <Star size={15} className="text-amber-400 fill-amber-400" />
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── YENİ ÜRÜN EKLE ── */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <h2 className="text-base font-black text-[#07446c] mb-6 flex items-center gap-2">
            <Plus size={18} className="text-[#0f75bc]" />
            Yeni Ürün Ekle
          </h2>

          {/* Temel bilgiler */}
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="space-y-4">
              <Field label="Ürün Adı *">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ör: Selofanlı Kartvizit"
                  className={inputCls}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="selofanli-kartvizit"
                  className={`${inputCls} font-mono text-xs`}
                />
              </Field>
              <Field label="Kategori">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Açıklama">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Ürün hakkında kısa açıklama..."
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0f75bc] accent-[#0f75bc]"
                />
                <span className="text-sm font-semibold text-[#07446c]">
                  Öne çıkan ürün
                </span>
              </label>
            </div>

            {/* Görsel yükleme */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-[#07446c] uppercase tracking-wide">
                Ürün Görseli
              </label>
              <label
                htmlFor="product-upload"
                className="flex-1 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#0f75bc] hover:bg-blue-50 transition-all min-h-[180px] relative overflow-hidden"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="önizleme"
                    fill
                    className="object-contain p-3"
                  />
                ) : (
                  <>
                    <Upload size={32} className="text-blue-200" />
                    <p className="text-sm text-slate-400 font-medium">
                      Görsel seçmek için tıklayın
                    </p>
                    <p className="text-xs text-slate-300">PNG, JPG, WEBP · Maks 5MB</p>
                  </>
                )}
              </label>
              <input
                id="product-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={onFileChange}
              />
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="text-xs text-red-400 hover:text-red-600 self-start"
                >
                  Görseli kaldır
                </button>
              )}
            </div>
          </div>

          {/* Fiyat Matrisi */}
          <div className="border-t border-blue-50 pt-6">
            <h3 className="text-sm font-black text-[#07446c] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#0f75bc] text-white rounded-full text-xs flex items-center justify-center font-black">
                ₺
              </span>
              Fiyat Matrisi
            </h3>
            <MatrixBuilder value={matrix} onChange={setMatrix} />
          </div>

          {/* Kaydet */}
          <button
            onClick={handleAdd}
            disabled={saving}
            className="mt-6 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {saving ? "Kaydediliyor…" : "Ürünü Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
