"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Phone, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const inputCls =
  "w-full border border-blue-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [phone, setPhone]         = useState("");
  const [kvkk, setKvkk]           = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!kvkk) {
      setError("KVKK metnini onaylamanız gerekmektedir.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    const { data, error: authErr } = await supabase.auth.signUp({ email, password });

    if (authErr) {
      setLoading(false);
      if (authErr.message.includes("already registered") || authErr.message.includes("already been registered")) {
        setError("Bu e-posta adresi zaten kayıtlı.");
      } else {
        setError(authErr.message);
      }
      return;
    }

    // Profil kaydı
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName.trim(),
        phone: `+90${phone.replace(/\D/g, "")}`,
      });
    }

    setLoading(false);
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07446c] to-[#0f75bc] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <Image src="/kmpbaskilogo.png" alt="KMP Baskı" width={40} height={40} className="object-contain h-10 w-auto" />
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-[#07446c]">KMP</span>
              <span className="text-[#25aae1]"> BASKI</span>
            </span>
          </a>
          <p className="text-sm text-slate-400">Hesap oluşturun, kolayca sipariş verin</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Ad Soyad */}
          <div>
            <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Ad Soyad *</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ali Yılmaz"
                className={inputCls}
              />
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">E-posta *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className={inputCls}
              />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Şifre *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className={inputCls}
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Telefon *</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 border border-blue-100 rounded-xl px-3 py-3 bg-gray-50 text-sm font-semibold text-gray-500 flex-shrink-0">
                🇹🇷 +90
              </div>
              <div className="relative flex-1">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="5XX XXX XX XX"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* KVKK + Pazarlama */}
          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={kvkk}
                onChange={(e) => setKvkk(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#0f75bc] flex-shrink-0"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <strong>KVKK Aydınlatma Metni</strong>&apos;ni okudum ve kabul ediyorum. Kişisel verilerimin işlenmesine onay veriyorum. *
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#0f75bc] flex-shrink-0"
              />
              <span className="text-xs text-slate-500 leading-relaxed">
                Kampanya ve fırsatlardan haberdar olmak için pazarlama iletişimine izin veriyorum. (İsteğe bağlı)
              </span>
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Kayıt yapılıyor…" : "Üye Ol"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-[#0f75bc] font-bold hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
