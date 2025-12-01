export default function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl overflow-hidden mb-8 animate-pulse">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4">
        <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
        <div className="col-span-3 h-4 bg-gray-200 rounded"></div>
        <div className="col-span-4 h-4 bg-gray-200 rounded"></div>
        <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
        <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
      </div>
      
      {/* Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-gray-100">
          <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
          <div className="col-span-3 h-4 bg-gray-200 rounded"></div>
          <div className="col-span-4 h-4 bg-gray-200 rounded"></div>
          <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
          <div className="col-span-2 flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
