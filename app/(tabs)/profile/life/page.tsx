import BeforePage from '@/components/BeforePage';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getMyPost(id: number) {
  const posts = await db.post.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      title: true,
      created_at: true,
    },
  });
  return posts;
}

export default async function MyPost() {
  const user = await getSession();
  if (!user) {
    return notFound();
  }
  const posts = await getMyPost(user.id!);
  if (!posts) {
    return notFound();
  }
  return (
    <>
      <div className="p-5">
        <BeforePage />
        <div className="">
          <div className="flex flex-col gap-3 justify-start pt-5 border-b-2 border-neutral-600 py-5">
            <h1 className="text-xl font-semibold">작성한 글</h1>
            <Link
              href="/life/add"
              className="border-2 rounded-xl text-center py-2 px-0 text-sm bg-white w-24"
            >
              글쓰기
            </Link>
          </div>
          <div className="border-b-2 border-neutral-500 border-opacity-40 pb-5 last:border-b-0">
            <div>
              {posts.map((post) => (
                <>
                  <div className="py-4 border-b border-neutral-600 last:border-b-0">
                    <Link
                      href={`/posts/${post.id}`}
                      key={post.id}
                      className="text-lg text-white"
                    >
                      {post.title}
                    </Link>
                    <div key={post.id} className="text-neutral-500">
                      {formatDate(post.created_at.toString())}
                    </div>
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
