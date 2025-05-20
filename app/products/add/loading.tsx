import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black z-50">
      <Image
        src="/cow_beanie_crossbow.png"
        alt="cow_beanie_crossbow"
        width={300}
        height={300}
        className="animate-bounce"
      />
      <h1
        className="text-center
      font-semibold text-lg"
      >
        로딩 중 ...
      </h1>
    </div>
  );
}
