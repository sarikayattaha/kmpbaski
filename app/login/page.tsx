"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const inp = "w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all bg-gray-50 focus:bg-white";

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
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(
        err.message.includes("Invalid login credentials")
          ? "E-posta veya şifre hatalı."
          : err.message.includes("Email not confirmed")
          ? "Lütfen önce e-postanızı doğrulayın."
          : err.message
      );
      return;
    }
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07446c] via-[#0a5a8f] to-[#0f75bc] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <Image src="/kmpbaskilogo.png" alt="KMP Baskı" width={44} height={44} className="object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">
            KMP<span className="text-[#25aae1]"> BASKI</span>
          </span>
        </a>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-xl font-black text-[#07446c] mb-1">Giriş Yap</h1>
          <p className="text-sm text-gray-400 mb-7">Hesabınıza erişin</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="E-posta adresi" className={inp} />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Şifre" className={inp} />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600">
                <AlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-[#0f75bc] font-bold hover:underline">Üye Ol</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
