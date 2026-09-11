import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ProductDetailSkeleton } from "@/app/components/skeletons/ProductDetailSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 h-[38px]" />
      </div>
      <main className="flex-1">
        <ProductDetailSkeleton />
      </main>
      <Footer />
    </div>
  );
}
