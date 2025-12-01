export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 h-80 w-50 animate-pulse">
      {/* Image placeholder */}
      <div className="flex items-center justify-center mb-4 h-40 w-full rounded-lg bg-gray-200"></div>
      
      {/* Title placeholder */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      
      {/* Lab name placeholder */}
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      
      {/* Button placeholder */}
      <div className="h-8 bg-gray-200 rounded-full w-20"></div>
    </div>
  );
}
