"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Mode = "checking" | "set-password" | "request-link" | "link-error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("checking");
  const [linkErrorMessage, setLinkErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [requestErr, setRequestErr] = useState(false);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);

    if (params.has("error")) {
      setLinkErrorMessage(
        params.get("error_code") === "otp_expired"
          ? "Bu bağlantının süresi dolmuş. Aşağıdan yeni bir bağlantı isteyebilirsiniz."
          : "Bağlantı geçersiz. Aşağıdan yeni bir bağlantı isteyebilirsiniz."
      );
      setMode("link-error");
      return;
    }

    if (params.get("type") === "recovery" && params.has("access_token")) {
      setMode("set-password");
      return;
    }

    setMode("request-link");
  }, []);

  const handleRequestLink = async () => {
    if (!email) return;
    setRequestErr(false);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setRequestErr(true);
      return;
    }
    setRequestSent(true);
  };

  const handleSetPassword = async () => {
    if (password.length < 6) {
      setSaveErr("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (password !== password2) {
      setSaveErr("Şifreler eşleşmiyor.");
      return;
    }
    setSaving(true);
    setSaveErr("");
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setSaveErr("Şifre güncellenemedi — bağlantının süresi dolmuş olabilir, yeni bir bağlantı isteyin.");
      return;
    }
    setSaved(true);
    setTimeout(() => router.replace("/admin/urun-yonetimi"), 1200);
  };

  const inputClass =
    "w-full border rounded-xl px-4 py-3 text-sm mb-3 border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07446c] to-[#0f75bc] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#0f75bc]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound size={28} className="text-[#0f75bc]" />
          </div>
          <h1 className="text-xl font-black text-[#07446c]">KMP BASKI</h1>
          <p className="text-sm text-slate-400 mt-1">Şifre Sıfırlama</p>
        </div>

        {mode === "checking" && <p className="text-sm text-slate-400 text-center">Yükleniyor...</p>}

        {mode === "set-password" && !saved && (
          <>
            <input
              type="password"
              placeholder="Yeni şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetPassword()}
              className={inputClass}
            />
            <button
              onClick={handleSetPassword}
              disabled={saving}
              className="w-full bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Şifreyi Kaydet"}
            </button>
            {saveErr && <p className="text-xs text-red-500 text-center mt-2">{saveErr}</p>}
          </>
        )}

        {mode === "set-password" && saved && (
          <p className="text-sm text-emerald-600 text-center font-semibold">
            Şifre güncellendi, yönlendiriliyorsunuz...
          </p>
        )}

        {(mode === "request-link" || mode === "link-error") && !requestSent && (
          <>
            {mode === "link-error" && (
              <p className="text-xs text-red-500 text-center mb-3">{linkErrorMessage}</p>
            )}
            <input
              type="email"
              placeholder="Admin e-posta adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRequestLink()}
              className={inputClass}
            />
            <button
              onClick={handleRequestLink}
              className="w-full bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Sıfırlama Bağlantısı Gönder
            </button>
            {requestErr && (
              <p className="text-xs text-red-500 text-center mt-2">Gönderilemedi, tekrar deneyin.</p>
            )}
          </>
        )}

        {requestSent && (
          <p className="text-sm text-emerald-600 text-center font-semibold">
            E-postanıza bir bağlantı gönderildi. Gelen kutunuzu kontrol edin.
          </p>
        )}
      </div>
    </div>
  );
}
