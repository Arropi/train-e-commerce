export default function LoadingOverlay() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-[#004CB0]/20 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#004CB0] rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
