"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "kmpbaski2024";

export default function AdminLogin() {
  const router = useRouter();
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);

  const handleLogin = () => {
    if (pass === ADMIN_KEY) {
      sessionStorage.setItem("kmp_admin", "1");
      router.replace("/admin/urun-yonetimi");
    } else {
      setPassErr(true);
      setTimeout(() => setPassErr(false), 1500);
    }
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
          type="password"
          placeholder="Yönetici şifresi"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={`w-full border rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all ${
            passErr ? "border-red-400 bg-red-50" : "border-blue-100"
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
      </div>
    </div>
  );
}
