import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black z-50">
      <Image
        src="/health2.png"
        alt="덤벨"
        width={300}
        height={300}
        className="animate-bounce"
      />
      <h1
        className="text-center
      font-semibold text-lg"
      >
        앞사람이 덤벨 훔쳐가는 중 ...
      </h1>
    </div>
  );
}
