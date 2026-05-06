"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { supabase, type Banner } from "@/lib/supabase";
import {
  Upload, Trash2, Plus, LogOut, ImageIcon,
  Loader2, CheckCircle, AlertCircle, ArrowUp, ArrowDown,
} from "lucide-react";
import AdminGuard from "@/app/admin/_components/AdminGuard";

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {msg}
    </div>
  );
}

export default function BannerYonetimi() {
  return <AdminGuard><BannerYonetimiInner /></AdminGuard>;
}

function BannerYonetimiInner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);

  const [btnText, setBtnText] = useState("");
  const [btnLink, setBtnLink] = useState("/tum-urunler");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [btnPos, setBtnPos] = useState({ x: 85, y: 80 });
  const [dragging, setDragging] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .order("order_index", { ascending: true });
      setBanners((data as Banner[]) ?? []);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ── Sürükle-bırak ── */
  const calcPos = useCallback((e: React.PointerEvent) => {
    if (!previewRef.current) return null;
    const rect = previewRef.current.getBoundingClientRect();
    return {
      x: Math.min(97, Math.max(3, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(93, Math.max(7, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const pos = calcPos(e);
    if (pos) setBtnPos(pos);
  }, [dragging, calcPos]);

  const onPointerUp = useCallback(() => setDragging(false), []);

  /* ── Ekle ── */
  const handleAdd = async () => {
    if (!file) return showToast("Lütfen bir görsel seçin.", "error");
    setSaving(true);

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("banner-images")
      .upload(path, file, { upsert: true });

    if (upErr) {
      setSaving(false);
      return showToast("Görsel yüklenemedi: " + upErr.message, "error");
    }

    const { data: urlData } = supabase.storage.from("banner-images").getPublicUrl(path);

    const { error } = await supabase.from("banners").insert({
      title: "",
      image_url: urlData.publicUrl,
      button_text: btnText.trim() || "Hemen Sipariş Ver",
      button_link: btnLink.trim() || "/tum-urunler",
      button_x: Math.round(btnPos.x * 10) / 10,
      button_y: Math.round(btnPos.y * 10) / 10,
      order_index: banners.length,
    });

    setSaving(false);
    if (error) return showToast("Kayıt hatası: " + error.message, "error");

    showToast("Banner başarıyla eklendi!", "success");
    setBtnText("");
    setBtnLink("/tum-urunler");
    setFile(null);
    setPreview(null);
    setBtnPos({ x: 85, y: 80 });
    if (fileRef.current) fileRef.current.value = "";
    fetchBanners();
  };

  /* ── Sil ── */
  const handleDelete = async (banner: Banner) => {
    if (!confirm("Bu banner silinsin mi?")) return;
    if (banner.image_url) {
      const path = banner.image_url.split("/").pop();
      if (path) await supabase.storage.from("banner-images").remove([path]);
    }
    const { error } = await supabase.from("banners").delete().eq("id", banner.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");
    showToast("Banner silindi.", "success");
    fetchBanners();
  };

  /* ── Sıra ── */
  const moveOrder = async (banner: Banner, dir: "up" | "down") => {
    const newOrder = dir === "up" ? banner.order_index - 1 : banner.order_index + 1;
    await supabase.from("banners").update({ order_index: newOrder }).eq("id", banner.id);
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg">
            KMP<span className="text-[#25aae1]">BASKI</span> — Banner Yönetimi
          </h1>
          <p className="text-blue-200 text-xs mt-0.5">Ana sayfa vitrin banner&apos;larını yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/urun-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">Ürün Yönetimi →</a>
          <a href="/admin/kategori-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">Kategori Yönetimi →</a>
          <button
            onClick={() => { sessionStorage.removeItem("kmp_admin"); window.location.href = "/admin/login"; }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <LogOut size={15} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* YENİ BANNER EKLE */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <h2 className="text-base font-black text-[#07446c] mb-5 flex items-center gap-2">
            <Plus size={18} className="text-[#0f75bc]" /> Yeni Banner Ekle
          </h2>

          {/* Görsel yükleme */}
          {!preview ? (
            <label
              htmlFor="banner-upload"
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer hover:border-[#0f75bc] hover:bg-blue-50 transition-all py-10 mb-5"
            >
              <Upload size={36} className="text-blue-200" />
              <p className="text-sm text-slate-400 font-medium">Görsel seçmek için tıklayın</p>
              <p className="text-xs text-slate-300">PNG, JPG, WEBP · Önerilen boyut: 1920 × 520 px</p>
            </label>
          ) : (
            <div className="mb-5">
              {/* Sürükle-bırak önizleme */}
              <p className="text-xs font-bold text-[#07446c] uppercase tracking-wide mb-2">
                Buton Konumu — Butonu sürükleyerek istediğiniz yere taşıyın
              </p>
              <div
                ref={previewRef}
                className="relative w-full overflow-hidden rounded-xl select-none"
                style={{ aspectRatio: "1920 / 520" }}
              >
                <Image src={preview} alt="Önizleme" fill className="object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-black/35 pointer-events-none" />

                {/* Sürüklenebilir buton */}
                <div
                  className={`absolute z-10 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                  style={{
                    left: `${btnPos.x}%`,
                    top: `${btnPos.y}%`,
                    transform: "translate(-50%, -50%)",
                    touchAction: "none",
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  <span className="inline-block bg-[#0f75bc] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg ring-2 ring-white/60 whitespace-nowrap select-none">
                    {btnText || "Hemen Sipariş Ver"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Görseli değiştir
              </button>
            </div>
          )}

          <input id="banner-upload" type="file" accept="image/*" className="hidden" ref={fileRef} onChange={onFileChange} />

          {/* Buton ayarları */}
          <div className="grid sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">
                Buton Metni <span className="text-slate-400 normal-case font-normal">(isteğe bağlı)</span>
              </label>
              <input
                value={btnText}
                onChange={(e) => setBtnText(e.target.value)}
                placeholder="Örn: Hemen Sipariş Ver"
                className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">
                Banner Linki
              </label>
              <input
                value={btnLink}
                onChange={(e) => setBtnLink(e.target.value)}
                placeholder="/tum-urunler"
                className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mb-5">
            Banner linki, görsele tıklandığında gidilecek sayfadır. Buton metni boş bırakılırsa sadece görsel tıklanabilir olur.
          </p>

          <button
            onClick={handleAdd}
            disabled={saving || !file}
            className="flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-50 text-white font-bold px-7 py-3 rounded-2xl transition-colors shadow-md"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {saving ? "Kaydediliyor…" : "Banner Ekle"}
          </button>
        </div>

        {/* MEVCUT BANNERLAR */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <h2 className="text-base font-black text-[#07446c] mb-5 flex items-center gap-2">
            <ImageIcon size={18} className="text-[#0f75bc]" />
            Mevcut Bannerlar
            {!loading && (
              <span className="ml-auto text-xs bg-[#0f75bc]/10 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">
                {banners.length} adet
              </span>
            )}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={28} className="animate-spin text-slate-300" />
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-slate-300">
              <ImageIcon size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Henüz banner eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((b) => (
                <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl border border-blue-50 hover:border-blue-200 hover:bg-slate-50 transition-all">
                  <div className="w-32 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] flex-shrink-0 relative">
                    {b.image_url
                      ? <Image src={b.image_url} alt="banner" fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-[#0f75bc]/40" /></div>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#07446c] text-sm">{b.button_text || "—"}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{b.button_link}</p>
                    <p className="text-[10px] text-[#25aae1] mt-1 font-semibold">
                      Konum: soldan {Math.round(b.button_x ?? 85)}% · üstten {Math.round(b.button_y ?? 80)}%
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => moveOrder(b, "up")} className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors"><ArrowUp size={15} /></button>
                    <button onClick={() => moveOrder(b, "down")} className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors"><ArrowDown size={15} /></button>
                    <button onClick={() => handleDelete(b)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
