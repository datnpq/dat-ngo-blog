export default function BlogLoading() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-10 sm:py-14">
      {/* Header */}
      <header className="mb-8 pb-8 border-b border-border">
        <div className="skeleton h-9 w-40 rounded-lg mb-3" />
        <div className="skeleton h-4 w-80 max-w-full rounded" />
        <div className="flex flex-wrap gap-2 mt-5">
          {[64, 120, 96, 56, 88, 72].map((w, i) => (
            <div key={i} className="skeleton h-7 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </header>

      {/* Featured skeleton */}
      <div className="mb-10 pb-10 border-b border-border">
        <div className="skeleton aspect-[2/1] w-full rounded-2xl mb-5" />
        <div className="skeleton h-3 w-24 rounded mb-3" />
        <div className="skeleton h-7 w-3/4 rounded-lg mb-3" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>

      {/* List skeletons */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="py-6 border-b border-border flex gap-5">
          <div className="flex-1">
            <div className="skeleton h-3 w-20 rounded mb-2" />
            <div className="skeleton h-5 w-5/6 rounded mb-2" />
            <div className="skeleton h-4 w-full rounded mb-1.5" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
          <div className="skeleton shrink-0 w-28 sm:w-36 h-20 sm:h-24 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
