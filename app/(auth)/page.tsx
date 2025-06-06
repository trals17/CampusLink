import Link from "next/link";
import "@/lib/db";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl animate-bounce transition-transform">
          <Image
            src="/img-mascot.png"
            alt="와우 이미지"
            width={100}
            height={100}
          />
        </span>
        <h1 className="text-4xl font-semibold text-red-400 ">CampusLink</h1>
        <h2 className="text-2xl"></h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full p-6">
        <Link href="/create-account" className="primary-btn py-2 text-lg">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline underline-offset-4">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
