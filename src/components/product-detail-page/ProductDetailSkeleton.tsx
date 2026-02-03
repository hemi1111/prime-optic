export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="h-96 lg:h-[500px] bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
