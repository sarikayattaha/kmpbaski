"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (authErr) {
      if (authErr.message.includes("Invalid login credentials")) {
        setError("E-posta veya şifre hatalı.");
      } else if (authErr.message.includes("Email not confirmed")) {
        setError("Lütfen önce e-postanızı doğrulayın.");
      } else {
        setError(authErr.message);
      }
      return;
    }

    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07446c] to-[#0f75bc] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <Image src="/kmpbaskilogo.png" alt="KMP Baskı" width={40} height={40} className="object-contain h-10 w-auto" />
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-[#07446c]">KMP</span>
              <span className="text-[#25aae1]"> BASKI</span>
            </span>
          </a>
          <p className="text-sm text-slate-400">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">
              E-posta
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="w-full border border-blue-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-blue-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all"
              />
            </div>
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
            className="w-full bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-[#0f75bc] font-bold hover:underline">
            Üye Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
