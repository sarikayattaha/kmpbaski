"use client";

import { useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app/error.tsx]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-[#07446c] mb-2">Bir Şeyler Ters Gitti</h1>
          <p className="text-sm text-gray-500 mb-6">
            Sayfa yüklenirken beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          <button
            onClick={() => unstable_retry()}
            className="bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
