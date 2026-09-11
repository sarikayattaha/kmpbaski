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
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
          <ProductGridSkeleton withSidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
}
