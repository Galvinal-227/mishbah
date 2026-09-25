import { Skeleton } from '../ui/Skeleton';

export default function ReaderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="card p-6">
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Ayat skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-3">
            <Skeleton className="ml-auto h-10 w-4/5" />
            <Skeleton className="ml-auto h-10 w-3/5" />
          </div>
          <div className="mt-5 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
}