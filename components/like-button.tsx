'use client';

import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { useOptimistic } from 'react';
import { dislikePost, likePost } from '@/app/posts/[id]/actions';
import { revalidateTag } from 'next/cache';

interface ILikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: ILikeButtonProps) {
  const [state, reduceFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => {
      return {
        isLiked: !previousState.isLiked,
        likeCount: previousState.isLiked ? previousState.likeCount - 1 : +1,
      };
    }
  );

  const onClick = async () => {
    reduceFn(null);
    if (isLiked) {
      await dislikePost(postId);
      revalidateTag('posts-list');
    } else {
      await likePost(postId);
      revalidateTag('posts-list');
    }
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
          state.isLiked
            ? 'bg-orange-500 text-white border-orange-500'
            : 'hover:bg-neutral-800'
        }`}
      >
        {state.isLiked ? (
          <HandThumbUpIcon className="size-5" />
        ) : (
          <OutlineHandThumbUpIcon className="size-5" />
        )}
        {state.isLiked ? (
          <span> {state.likeCount}</span>
        ) : (
          <span>공감하기 ({state.likeCount})</span>
        )}
      </button>
    </>
  );
}
