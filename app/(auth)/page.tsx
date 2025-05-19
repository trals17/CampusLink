import Link from 'next/link';
import '@/lib/db';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl animate-bounce transition-transform">
          <Image src="/main.png" alt="헬스 이미지" width={200} height={200} />
        </span>
        <h1 className="text-4xl font-semibold text-red-400 ">운동감자</h1>
        <h2 className="text-2xl">운동하는 감자가 되자</h2>
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
