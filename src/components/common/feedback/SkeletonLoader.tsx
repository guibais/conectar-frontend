type SkeletonLoaderProps = {
  className?: string;
  rows?: number;
  height?: string;
};

export function SkeletonLoader({
  className = "",
  rows = 1,
  height = "h-4",
}: SkeletonLoaderProps) {
  return (
    <output
      className={`animate-pulse ${className}`}
      role="status"
      aria-label="Carregando conteúdo"
      aria-live="polite"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded-md ${height} ${index > 0 ? "mt-2" : ""}`}
          aria-hidden="true"
        />
      ))}
    </output>
  );
}

export function TableSkeleton() {
  return (
    <output
      className="animate-pulse"
      role="status"
      aria-label="Carregando tabela"
      aria-live="polite"
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-1/4" aria-hidden="true" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="px-6 py-4 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              <div
                className="h-4 bg-gray-200 rounded w-1/4"
                aria-hidden="true"
              ></div>
              <div
                className="h-4 bg-gray-200 rounded w-1/3"
                aria-hidden="true"
              ></div>
              <div
                className="h-4 bg-gray-200 rounded w-1/6"
                aria-hidden="true"
              ></div>
              <div
                className="h-4 bg-gray-200 rounded w-1/5"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </output>
  );
}

export function CardSkeleton() {
  return (
    <div
      className="animate-pulse bg-white rounded-lg border border-gray-200 p-6"
      role="status"
      aria-label="Carregando card"
      aria-live="polite"
    >
      <div
        className="h-6 bg-gray-200 rounded w-1/3 mb-4"
        aria-hidden="true"
      ></div>
      <div className="space-y-3">
        <div
          className="h-4 bg-gray-200 rounded w-full"
          aria-hidden="true"
        ></div>
        <div className="h-4 bg-gray-200 rounded w-3/4" aria-hidden="true" />
        <div className="h-4 bg-gray-200 rounded w-1/2" aria-hidden="true" />
      </div>
    </div>
  );
}
