"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

function ErrorInner() {
  const params  = useSearchParams();
  const message = params.get("message") ?? "Bir hata oluştu.";

  const isExpired = message.toLowerCase().includes("expired") || message.toLowerCase().includes("invalid");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07446c] to-[#0f75bc] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
        <a href="/" className="inline-flex items-center gap-2.5 justify-center mb-6">
          <Image src="/kmpbaskilogo.png" alt="KMP Baskı" width={40} height={40} className="object-contain h-10 w-auto" />
          <span className="text-xl font-black tracking-tight leading-none">
            <span className="text-[#07446c]">KMP</span>
            <span className="text-[#25aae1]"> BASKI</span>
          </span>
        </a>
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={36} className="text-red-500" />
        </div>
        <h2 className="text-xl font-black text-[#07446c] mb-2">
          {isExpired ? "Bağlantı Süresi Doldu" : "Bir Hata Oluştu"}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {isExpired
            ? "E-posta onay bağlantısının süresi dolmuş. Lütfen yeniden kayıt olun."
            : message}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/register"
            className="block w-full bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Yeniden Kayıt Ol
          </Link>
          <Link
            href="/login"
            className="block w-full border border-blue-100 text-[#07446c] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorInner />
    </Suspense>
  );
}
