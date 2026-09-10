"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginErr, setLoginErr] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) {
      setLoginErr(true);
      setTimeout(() => setLoginErr(false), 1500);
      return;
    }
    router.replace("/admin/urun-yonetimi");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07446c] to-[#0f75bc] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#0f75bc]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={28} className="text-[#0f75bc]" />
          </div>
          <h1 className="text-xl font-black text-[#07446c]">KMP BASKI</h1>
          <p className="text-sm text-slate-400 mt-1">Yönetim Paneli</p>
        </div>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={`w-full border rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all ${
            loginErr ? "border-red-400 bg-red-50" : "border-blue-100"
          }`}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={`w-full border rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all ${
            loginErr ? "border-red-400 bg-red-50" : "border-blue-100"
          }`}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
        {loginErr && (
          <p className="text-xs text-red-500 text-center mt-2">Hatalı e-posta veya şifre.</p>
        )}
      </div>
    </div>
  );
}
