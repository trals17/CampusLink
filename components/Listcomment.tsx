'use client';

import { formatToTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import EditComment from './EditComment';
import DeleteCommentBtn from './deleteBtn';

interface Comment {
  id: number;
  payload: string;
  created_at: Date;
  user: {
    username: string;
    avatar: string | null;
  };
}

interface ListCommentProps {
  comments: Comment[];
}

export default function ListComment({ comments }: ListCommentProps) {
  return (
    <div className="flex flex-col gap-6 mt-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="relative flex flex-col gap-4 p-4 bg-neutral-800 rounded-lg shadow-md"
        >
          <div className="absolute top-2 right-2">
            <DeleteCommentBtn commentId={comment.id} />
          </div>
          <div className="flex items-start gap-4">
            <Image
              src={`${comment.user.avatar}/avatar`}
              alt={comment.user.username}
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-white">
                  {comment.user.username}
                </p>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs text-neutral-400">
                  {formatToTimeAgo(comment.created_at.toString())}
                </span>
              </div>
              <p className="text-sm text-neutral-300 mb-2">{comment.payload}</p>
              <EditComment payload={comment.payload} commentId={comment.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
