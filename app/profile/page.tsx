"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User, Phone, MapPin, Mail, Loader2, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const inp = "w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all bg-gray-50 focus:bg-white";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uid, setUid]           = useState("");
  const [email, setEmail]       = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace("/login"); return; }
        if (cancelled) return;

        setUid(session.user.id);
        setEmail(session.user.email ?? "");

        const { data } = await supabase
          .from("profiles")
          .select("full_name, phone, address")
          .eq("id", session.user.id)
          .single();

        if (cancelled) return;
        if (data) {
          const p = data as { full_name?: string; phone?: string; address?: string };
          setFullName(p.full_name ?? "");
          setPhone(p.phone ?? "");
          setAddress(p.address ?? "");
        }
      } catch { /* hata olsa bile loading kapanır */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const notify = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id ?? uid;
      if (!id) { router.replace("/login"); return; }

      const { error } = await supabase.from("profiles").upsert(
        { id, full_name: fullName.trim(), phone: phone.trim(), address: address.trim() },
        { onConflict: "id" }
      );
      if (error) notify("Hata: " + error.message, false);
      else notify("Bilgileriniz güncellendi.", true);
    } catch { notify("Beklenmeyen bir hata oluştu.", false); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f8ff] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#0f75bc]" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f8ff] flex flex-col">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${toast.ok ? "bg-green-500" : "bg-red-500"}`}>
          {toast.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-10">

          {/* Başlık */}
          <div className="mb-7">
            <h1 className="text-2xl font-black text-[#07446c]">Profilim</h1>
            <p className="text-sm text-gray-400 mt-0.5">{email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">

            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Ad Soyad" className={inp} />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} disabled
                className="w-full border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>

            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="Telefon numarası" className={inp} />
            </div>

            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
              <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Teslimat adresi"
                className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all bg-gray-50 focus:bg-white resize-none" />
              <p className="text-xs text-gray-400 mt-1.5 pl-1">Sepette otomatik doldurulur.</p>
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
            </button>
          </form>

          {/* Çıkış Yap */}
          <div className="mt-4">
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-3.5 rounded-2xl transition-colors text-sm">
              <LogOut size={16} /> Çıkış Yap
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
