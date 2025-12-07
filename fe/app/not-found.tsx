import Image from "next/image";


export default function NotFoundPage() {
  return (
    <div className="flex flex-col gap-15 items-center justify-center min-h-screen bg-white">
      <Image
        src="/images/notFoundd.webp"
        alt="404 Not Found"
        width={500}
        height={500}
        className="object-contain"
      />
    </div>

  );
}