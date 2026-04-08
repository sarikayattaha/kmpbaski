"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Profile } from "@/lib/supabase";
import { User, Phone, MapPin, Loader2, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const inputCls =
  "w-full border border-blue-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [userId, setUserId]     = useState<string | null>(null);
  const [email, setEmail]       = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const user = data.session.user;
      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (prof) {
        const p = prof as Profile;
        setFullName(p.full_name ?? "");
        setPhone(p.phone ?? "");
        setAddress(p.address ?? "");
      }
      setLoading(false);
    });
  }, [router]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    setSaving(false);
    if (error) {
      showToast("Kayıt hatası: " + error.message, "error");
    } else {
      showToast("Bilgileriniz güncellendi.", "success");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f8ff] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-300">
          <Loader2 size={32} className="animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f8ff] flex flex-col">
      <Navbar />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-lg mx-auto px-6 py-12">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-[#07446c]">Profilim</h1>
              <p className="text-sm text-gray-400 mt-0.5">{email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors font-semibold"
            >
              <LogOut size={15} /> Çıkış
            </button>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 space-y-5">

            {/* Ad Soyad */}
            <div>
              <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Ad Soyad</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ali Yılmaz"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Telefon</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Teslimat Adresi */}
            <div>
              <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Teslimat Adresi</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Mahalle, Cadde/Sokak No, İlçe / İl"
                  className="w-full border border-blue-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all resize-none"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Sepette otomatik doldurulur, her siparişte tekrar girmek zorunda kalmazsınız.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
