'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { revalidateTag } from 'next/cache';
import z from 'zod';

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

//comments 저장하기

const formSchema = z.object({
  payload: z.string().trim().min(1, '댓글 내용을 입력해주세요.'),
  userId: z.number(),
  postId: z.number(),
});

export default async function CommentAction(
  prevState: any,
  formData: FormData
) {
  const data = {
    payload: formData.get('payload'),
    userId: Number(formData.get('userId')),
    postId: Number(formData.get('postId')),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten() };
  } else {
    const newComment = await db.comment.create({
      data: {
        payload: result.data.payload,
        userId: result.data.userId,
        postId: result.data.postId,
      },
      select: {
        id: true,
      },
    });

    revalidateTag('posts-list');
    return { data: newComment };
  }
}

export async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: { postId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      user: {
        select: {
          username: true,
          avatar: true,
          id: true,
        },
      },
    },
  });
  return comments;
}

export async function getUserId() {
  const session = await getSession();
  const userId = session.id!;
  return userId;
}
