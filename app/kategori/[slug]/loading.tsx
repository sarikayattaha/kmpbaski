import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ProductGridSkeleton } from "@/app/components/skeletons/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 h-[38px]" />
      </div>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-9 w-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <ProductGridSkeleton />
      </main>
      <Footer />
    </div>
  );
}
