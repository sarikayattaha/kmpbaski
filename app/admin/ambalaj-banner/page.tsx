"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase, type AmbalajBanner } from "@/lib/supabase";
import {
  Upload,
  Trash2,
  Plus,
  LogOut,
  ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X,
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

export default function AmbalajBannerYonetimi() {
  return <AdminGuard><AmbalajBannerYonetimiInner /></AdminGuard>;
}

function AmbalajBannerYonetimiInner() {
  const [banners, setBanners] = useState<AmbalajBanner[]>([]);
  const [loading, setLoading] = useState(false);

  /* Form state */
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [btnText, setBtnText] = useState("");
  const [btnLink, setBtnLink] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  /* Multiple images */
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kmp_admin");
    window.location.href = "/admin/login";
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("ambalaj_banners")
        .select("*")
        .order("order_index", { ascending: true });
      setBanners((data as AmbalajBanner[]) ?? []);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImages = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setImageFiles(prev => [...prev, ...newImages]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeNewImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `ambalaj-banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("banner-images").upload(path, file, { upsert: true });
    if (error) { showToast("Görsel yüklenemedi: " + error.message, "error"); return null; }
    return supabase.storage.from("banner-images").getPublicUrl(path).data.publicUrl;
  };

  const handleAdd = async () => {
    if (!title.trim()) return showToast("Başlık zorunludur.", "error");
    setSaving(true);

    const uploadedUrls: string[] = [];
    for (const img of imageFiles) {
      const url = await uploadFile(img.file);
      if (!url) { setSaving(false); return; }
      uploadedUrls.push(url);
    }

    const { error } = await supabase.from("ambalaj_banners").insert({
      title: title.trim(),
      subtitle: subtitle.trim(),
      button_text: btnText.trim(),
      button_link: btnLink.trim(),
      order_index: orderIndex,
      images: uploadedUrls,
    });

    setSaving(false);
    if (error) return showToast("Kayıt hatası: " + error.message, "error");

    showToast("Banner eklendi!", "success");
    setTitle(""); setSubtitle(""); setBtnText(""); setBtnLink(""); setOrderIndex(0);
    setImageFiles([]);
    fetchBanners();
  };

  const handleDelete = async (banner: AmbalajBanner) => {
    if (!confirm(`"${banner.title}" silinsin mi?`)) return;
    const { error } = await supabase.from("ambalaj_banners").delete().eq("id", banner.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");
    showToast("Banner silindi.", "success");
    fetchBanners();
  };

  const moveOrder = async (banner: AmbalajBanner, dir: "up" | "down") => {
    const newOrder = dir === "up" ? banner.order_index - 1 : banner.order_index + 1;
    await supabase.from("ambalaj_banners").update({ order_index: newOrder }).eq("id", banner.id);
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-black text-lg">KMP<span className="text-[#25aae1]">BASKI</span> — Ambalaj Banner Yönetimi</h1>
          <p className="text-blue-200 text-xs mt-0.5">Ambalaj sayfası hero banner&apos;larını yönetin</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a href="/admin/urun-yonetimi"     className="text-xs text-blue-300 hover:text-white transition-colors">Ürün Yönetimi →</a>
          <a href="/admin/kategori-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">Kategori Yönetimi →</a>
          <a href="/admin/banner-yonetimi"   className="text-xs text-blue-300 hover:text-white transition-colors">Banner Yönetimi →</a>
          <a href="/admin/ambalaj"           className="text-xs text-blue-300 hover:text-white transition-colors">Ambalaj Yönetimi →</a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <LogOut size={15} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* ── YENİ BANNER EKLE ── */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <h2 className="text-base font-black text-[#07446c] mb-5 flex items-center gap-2">
            <Plus size={18} className="text-[#0f75bc]" /> Yeni Banner Ekle
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Sol */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">Başlık *</label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Ör: Markanızı Yansıtan Ambalaj"
                  className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">Alt Başlık</label>
                <textarea value={subtitle} onChange={e => setSubtitle(e.target.value)}
                  rows={2} placeholder="Kısa açıklama metni"
                  className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">Buton Metni</label>
                  <input value={btnText} onChange={e => setBtnText(e.target.value)}
                    placeholder="Ör: Ürünleri İncele"
                    className="w-full border border-blue-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">Sıra</label>
                  <input type="number" value={orderIndex} onChange={e => setOrderIndex(Number(e.target.value))}
                    className="w-full border border-blue-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">Buton Linki</label>
                <input value={btnLink} onChange={e => setBtnLink(e.target.value)}
                  placeholder="/ambalaj/pastane-urunleri"
                  className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]" />
              </div>
            </div>

            {/* Sag — Coklu Gorsel */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide">
                Görseller (otomatik kaydırmalı)
              </label>

              {/* Eklenen görseller */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {imageFiles.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-blue-100 bg-gray-50 group">
                      <Image src={img.preview} alt={`görsel ${idx + 1}`} fill className="object-contain p-1" />
                      <button type="button" onClick={() => removeNewImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={11} />
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-black/50 text-white px-1.5 py-0.5 rounded-md">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Gorsel ekle butonu */}
              <label htmlFor="banner-img-upload"
                className="border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#0f75bc] hover:bg-blue-50 transition-all min-h-[100px]">
                <Upload size={24} className="text-blue-200" />
                <p className="text-sm text-slate-400 font-medium">Görsel eklemek için tıklayın</p>
                <p className="text-xs text-slate-300">Birden fazla seçebilirsiniz</p>
              </label>
              <input id="banner-img-upload" type="file" accept="image/*" multiple ref={fileRef} className="hidden" onChange={onFileChange} />
            </div>
          </div>

          <button onClick={handleAdd} disabled={saving}
            className="mt-6 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-7 py-3 rounded-2xl transition-colors shadow-md">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {saving ? "Kaydediliyor…" : "Banner Ekle"}
          </button>
        </div>

        {/* ── MEVCUT BANNERLAR ── */}
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
            <div className="flex items-center justify-center py-12 text-slate-300">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-slate-300">
              <ImageIcon size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Henüz banner eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map(b => (
                <div key={b.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-blue-50 hover:border-blue-200 hover:bg-slate-50 transition-all">

                  {/* Görsel önizleme (ilk görsel) */}
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] flex-shrink-0 relative">
                    {b.images && b.images.length > 0 ? (
                      <Image src={b.images[0]} alt={b.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={20} className="text-[#0f75bc]/40" />
                      </div>
                    )}
                    {b.images && b.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-black/60 text-white px-1 py-0.5 rounded">
                        +{b.images.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#07446c] truncate">{b.title}</p>
                    {b.subtitle && <p className="text-xs text-slate-400 truncate mt-0.5">{b.subtitle}</p>}
                    <p className="text-[10px] text-[#25aae1] mt-1 font-semibold">
                      Sıra: {b.order_index}
                      {b.images?.length ? ` · ${b.images.length} görsel` : ""}
                      {b.button_text ? ` · ${b.button_text}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => moveOrder(b, "up")} title="Yukarı"
                      className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors">
                      <ArrowUp size={15} />
                    </button>
                    <button onClick={() => moveOrder(b, "down")} title="Aşağı"
                      className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors">
                      <ArrowDown size={15} />
                    </button>
                    <button onClick={() => handleDelete(b)} title="Sil"
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
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
