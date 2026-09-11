export function ProductGridSkeleton({ withSidebar = false }: { withSidebar?: boolean }) {
  return (
    <div className="flex gap-8">
      {withSidebar && (
        <div className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl p-5 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-64 border border-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
