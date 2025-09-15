import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoading() {
  return (
    <div className="space-y-6">
    
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Chart 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>

      {/* Recent Activity Section Skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Tables Section Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Table 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
          
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}