import db from '@/lib/db';
import { formatToTimeAgo } from '@/lib/utils';
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import Image from 'next/image';

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          Comments: true,
          Like: true,
        },
      },
    },
  });
  return posts;
}

const getCachedPosts = nextCache(getPosts, ['posts-list'], {
  tags: ['posts-list'],
});

export const metadata = {
  title: '운동감자',
};

export default async function Life() {
  const posts = await getCachedPosts();
  if (!posts) {
    return notFound();
  }

  return (
    <div className="p-5 flex flex-col mb-24">
      <div className="border-b border-neutral-600 pb-5">
        <h1 className="text-center text-3xl flex flex-row justify-center items-center">
          <Image src="/설렘감자.png" alt="설렘감자" width={60} height={60} />
          <strong className="text-yellow-600">운동감자</strong>들의 이야기
        </h1>
      </div>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="pb-10 pt-5 text-neutral-400 flex flex-col gap-2 "
        >
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.Like}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.Comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/life/add"
        shallow
        className="bg-red-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-red-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
