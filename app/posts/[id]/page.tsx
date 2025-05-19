import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import {
  EyeIcon,
  HandThumbUpIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import LikeButton from '@/components/like-button';
import CommentForm from '@/components/commentForm';
import { getComments, getUserId } from './actions';
import Link from 'next/link';
import BeforePage from '@/components/BeforePage';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            Comments: true,
          },
        },
      },
    });

    return post;
  } catch (e) {
    return null;
  }
}
const getCachedPost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ['product-like-status'], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  const userId = await getUserId();
  const comments = await getComments(id);

  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  return (
    <div className="p-5 text-white">
      <div className="flex flex-col gap-4">
        <BeforePage />
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-2 mb-2">
            <Image
              width={45}
              height={45}
              className="rounded-full aspect-square"
              src={`${post.user.avatar!}/public`}
              alt={post.user.username}
            />
            <div>
              <span className="text-sm font-semibold">
                {post.user.username}
              </span>
              <div className="text-xs">
                <span>{formatToTimeAgo(post.created_at.toString())}</span>
              </div>
            </div>
          </div>
          <Link href={`/posts/${id}/edit`}>
            <PencilIcon className="size-5 text-white" />
          </Link>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
        <CommentForm postId={id} userId={userId} comments={comments} />
      </div>
    </div>
  );
}
