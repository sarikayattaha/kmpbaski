"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

function SuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next   = params.get("next") ?? "/";

  useEffect(() => {
    const timer = setTimeout(() => router.replace(next), 3000);
    return () => clearTimeout(timer);
  }, [router, next]);

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
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <h2 className="text-xl font-black text-[#07446c] mb-2">E-posta Onaylandı!</h2>
        <p className="text-sm text-slate-400 mb-6">
          Hesabınız aktifleştirildi. Ana sayfaya yönlendiriliyorsunuz…
        </p>
        <div className="w-full bg-blue-50 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-[#0f75bc] animate-[shrink_3s_linear_forwards]" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
