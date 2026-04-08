"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const inp = "w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all bg-gray-50 focus:bg-white";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress]   = useState("");
  const [kvkk, setKvkk]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!kvkk) { setError("KVKK onayı zorunludur."); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalıdır."); return; }

    setLoading(true);
    const formattedPhone = phone.startsWith("+") ? phone : `+90${phone.replace(/\D/g, "")}`;

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: formattedPhone,
          address: address.trim(),
        },
      },
    });

    setLoading(false);
    if (err) {
      setError(
        err.message.includes("already registered") || err.message.includes("already been registered")
          ? "Bu e-posta zaten kayıtlı."
          : err.message
      );
      return;
    }
    // Profil trigger ile otomatik oluşuyor
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07446c] via-[#0a5a8f] to-[#0f75bc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <Image src="/kmpbaskilogo.png" alt="KMP Baskı" width={44} height={44} className="object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">
            KMP<span className="text-[#25aae1]"> BASKI</span>
          </span>
        </a>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-xl font-black text-[#07446c] mb-1">Hesap Oluştur</h1>
          <p className="text-sm text-gray-400 mb-7">Kolayca sipariş verin, takip edin</p>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Ad Soyad */}
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Ad Soyad" className={inp} />
            </div>

            {/* E-posta */}
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="E-posta adresi" className={inp} />
            </div>

            {/* Telefon */}
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" required value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="5XX XXX XX XX" className={inp} />
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none select-none">
                {/* sadece placeholder görevi görüyor */}
              </span>
            </div>

            {/* Şifre */}
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Şifre (en az 6 karakter)" className={inp} />
            </div>

            {/* Teslimat Adresi */}
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
              <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Teslimat adresi (Mahalle, Cadde/Sokak No, İlçe / İl)"
                className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all bg-gray-50 focus:bg-white resize-none" />
            </div>

            {/* KVKK */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={kvkk} onChange={e => setKvkk(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#0f75bc] flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                <strong className="text-gray-700">KVKK Aydınlatma Metni</strong>&apos;ni okudum, kişisel verilerimin işlenmesine onay veriyorum. *
              </span>
            </label>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600">
                <AlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Kayıt yapılıyor…" : "Üye Ol"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-[#0f75bc] font-bold hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
