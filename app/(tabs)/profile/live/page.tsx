import BeforePage from '@/components/BeforePage';
import db from '@/lib/db';
import getSession from '@/lib/session';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getMyLive(userId: number) {
  const lives = await db.liveStream.findMany({
    where: {
      userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });
  return lives;
}

export default async function MyLive() {
  const user = await getSession();
  if (!user) {
    return notFound();
  }
  const lives = await getMyLive(user.id!);
  if (!lives) {
    return notFound();
  }
  return (
    <>
      <div className="p-5">
        <BeforePage />
        <div>
          <div className="flex flex-col gap-3 justify-start pt-5 border-b-2 border-neutral-600 py-5">
            <h1 className="text-xl">나의 라이브</h1>
            <Link
              href="/stream/add"
              className="border-2 rounded-xl text-center py-2 px-0 text-sm bg-white w-24"
            >
              스트리밍하기
            </Link>
          </div>
          <div className="border-b-2 border-neutral-500 border-opacity-40 pb-5 last:border-b-0">
            <div>
              {lives.map((live) => (
                <>
                  <div className="border-b border-neutral-600 py-4 last:border-b-0">
                    <Link
                      href={`/streams/${live.id}`}
                      className="text-white text-lg"
                      key={live.id}
                    >
                      {live.title}
                    </Link>
                    <div className="text-neutral-500">{live.description}</div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
