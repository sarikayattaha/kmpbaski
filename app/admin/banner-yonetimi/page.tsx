"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase, type Banner } from "@/lib/supabase";
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
} from "lucide-react";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "kmpbaski2024";

/* ── Bildirim bileşeni ── */
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold animate-bounce-in ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {msg}
    </div>
  );
}

export default function BannerYonetimi() {
  /* ── Auth ── */
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);

  /* ── Banner state ── */
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);

  /* ── Form state ── */
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [btnText, setBtnText] = useState("Hemen Sipariş Ver");
  const [btnLink, setBtnLink] = useState("#");
  const [orderIndex, setOrderIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ── Toast ── */
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Auth check (sessionStorage) ── */
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

  /* ── Bannerları yükle ── */
  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("order_index", { ascending: true });
    setBanners(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchBanners();
  }, [authed]);

  /* ── Dosya seçimi ── */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ── Banner ekle ── */
  const handleAdd = async () => {
    if (!title.trim()) return showToast("Başlık zorunludur.", "error");
    setSaving(true);

    let imageUrl = "";

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("banner-images")
        .upload(path, file, { upsert: true });

      if (upErr) {
        setSaving(false);
        return showToast("Görsel yüklenemedi: " + upErr.message, "error");
      }

      const { data: urlData } = supabase.storage
        .from("banner-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("banners").insert({
      title: title.trim(),
      subtitle: subtitle.trim(),
      image_url: imageUrl,
      button_text: btnText.trim() || "Hemen Sipariş Ver",
      button_link: btnLink.trim() || "#",
      order_index: orderIndex,
    });

    setSaving(false);

    if (error) return showToast("Kayıt hatası: " + error.message, "error");

    showToast("Banner başarıyla eklendi!", "success");
    setTitle(""); setSubtitle(""); setBtnText("Hemen Sipariş Ver");
    setBtnLink("#"); setOrderIndex(0); setFile(null); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    fetchBanners();
  };

  /* ── Banner sil ── */
  const handleDelete = async (banner: Banner) => {
    if (!confirm(`"${banner.title}" silinsin mi?`)) return;

    // Storage'dan sil
    if (banner.image_url) {
      const path = banner.image_url.split("/").pop();
      if (path) await supabase.storage.from("banner-images").remove([path]);
    }

    const { error } = await supabase.from("banners").delete().eq("id", banner.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");

    showToast("Banner silindi.", "success");
    fetchBanners();
  };

  /* ── Sıra değiştir ── */
  const moveOrder = async (banner: Banner, dir: "up" | "down") => {
    const newOrder = dir === "up" ? banner.order_index - 1 : banner.order_index + 1;
    await supabase.from("banners").update({ order_index: newOrder }).eq("id", banner.id);
    fetchBanners();
  };

  /* ══════════════════════════
     GİRİŞ EKRANI
  ══════════════════════════ */
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07446c] to-[#0f75bc] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#0f75bc]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={28} className="text-[#0f75bc]" />
            </div>
            <h1 className="text-xl font-black text-[#07446c]">KMP BASKI</h1>
            <p className="text-sm text-slate-400 mt-1">Admin Paneli</p>
          </div>

          <input
            type="password"
            placeholder="Yönetici şifresi"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`w-full border rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all ${
              passErr ? "border-red-400 bg-red-50 shake" : "border-blue-100"
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
          <p className="text-[10px] text-slate-300 text-center mt-4">
            Varsayılan: NEXT_PUBLIC_ADMIN_KEY değeri
          </p>
        </div>
      </div>
    );
  }

  /* ══════════════════════════
     ADMIN PANELİ
  ══════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg">
            KMP<span className="text-[#25aae1]">BASKI</span> — Banner Yönetimi
          </h1>
          <p className="text-blue-200 text-xs mt-0.5">Ana sayfa vitrin banner'larını yönetin</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <LogOut size={15} /> Çıkış
        </button>
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
                <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">
                  Başlık *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Kartvizit Kampanyası"
                  className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">
                  Alt Başlık
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={2}
                  placeholder="Kısa açıklama metni"
                  className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">
                    Buton Metni
                  </label>
                  <input
                    value={btnText}
                    onChange={(e) => setBtnText(e.target.value)}
                    className="w-full border border-blue-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full border border-blue-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#07446c] mb-1.5 uppercase tracking-wide">
                  Buton Linki
                </label>
                <input
                  value={btnLink}
                  onChange={(e) => setBtnLink(e.target.value)}
                  placeholder="/urunler/kartvizit"
                  className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]"
                />
              </div>
            </div>

            {/* Sağ — Görsel Yükleme */}
            <div className="flex flex-col gap-4">
              <label className="block text-xs font-bold text-[#07446c] mb-0 uppercase tracking-wide">
                Banner Görseli
              </label>
              <label
                htmlFor="banner-upload"
                className="flex-1 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#0f75bc] hover:bg-blue-50 transition-all min-h-[160px] relative overflow-hidden"
              >
                {preview ? (
                  <Image src={preview} alt="önizleme" fill className="object-contain p-2" />
                ) : (
                  <>
                    <Upload size={32} className="text-blue-200" />
                    <p className="text-sm text-slate-400 font-medium">Görsel seçmek için tıklayın</p>
                    <p className="text-xs text-slate-300">PNG, JPG, WEBP · Maks 5MB</p>
                  </>
                )}
              </label>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={onFileChange}
              />
              {preview && (
                <button
                  onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-xs text-red-400 hover:text-red-600 self-start"
                >
                  Görseli kaldır
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={saving}
            className="mt-6 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-7 py-3 rounded-2xl transition-colors shadow-md"
          >
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
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-blue-50 hover:border-blue-200 hover:bg-slate-50 transition-all"
                >
                  {/* Küçük resim */}
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] flex-shrink-0 relative">
                    {b.image_url ? (
                      <Image src={b.image_url} alt={b.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={20} className="text-[#0f75bc]/40" />
                      </div>
                    )}
                  </div>

                  {/* Bilgi */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#07446c] truncate">{b.title}</p>
                    {b.subtitle && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{b.subtitle}</p>
                    )}
                    <p className="text-[10px] text-[#25aae1] mt-1 font-semibold">
                      Sıra: {b.order_index} · {b.button_text}
                    </p>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => moveOrder(b, "up")}
                      title="Yukarı"
                      className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      onClick={() => moveOrder(b, "down")}
                      title="Aşağı"
                      className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors"
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      title="Sil"
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
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
