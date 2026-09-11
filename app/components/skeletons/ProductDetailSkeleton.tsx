export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">
        <div className="aspect-[4/3] rounded-3xl bg-white border border-gray-100 animate-pulse" />
        <div className="flex flex-col gap-5">
          <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-9 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 w-40 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
