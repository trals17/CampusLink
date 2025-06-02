// app/posts/[id]/page.tsx
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import {
  EyeIcon,
  HandThumbUpIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import CommentForm from "@/components/commentForm";
import { getComments, getUserId } from "./actions";
import Link from "next/link";
import BeforePage from "@/components/BeforePage";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: { views: { increment: 1 } },
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

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
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
  const userId = session.id!;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId);
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

  // 1) 포스트 불러오기 + 조회수 증가
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }

  // 2) 현재 로그인한 사용자 ID, 댓글, 좋아요 상태 조회
  const userId = await getUserId();
  const comments = await getComments(id);
  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  // 3) 프로필 이미지 URL 조합 로직
  const userAvatarUrl = post.user.avatar
    ? post.user.avatar.startsWith("http")
      ? post.user.avatar
      : `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${post.user.avatar}/public`
    : null;

  return (
    <div className="p-5 text-white">
      <div className="flex flex-col gap-4">
        <BeforePage />

        {/* 작성자 정보 (프로필 이미지 + 사용자명 + 작성 시간) */}
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-2 mb-2">
            {userAvatarUrl ? (
              <Image
                width={45}
                height={45}
                className="rounded-full aspect-square"
                src={userAvatarUrl}
                alt={post.user.username}
              />
            ) : (
              /* avatar가 없으면 빈 프로필 아이콘 혹은 더미 이미지를 표시 */
              <div className="w-[45px] h-[45px] rounded-full bg-neutral-700" />
            )}
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

        {/* 제목, 내용 */}
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>

        {/* 조회수, 좋아요 버튼 */}
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>

        {/* 댓글 폼 + 댓글 목록 */}
        <CommentForm postId={id} userId={userId} comments={comments} />
      </div>
    </div>
  );
}
