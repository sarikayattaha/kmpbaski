import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#e0f2fe] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <SearchX size={32} className="text-[#0f75bc]" />
          </div>
          <h1 className="text-2xl font-black text-[#07446c] mb-2">Sayfa Bulunamadı</h1>
          <p className="text-sm text-gray-500 mb-6">
            Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
