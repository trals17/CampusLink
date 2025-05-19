'use server';

import db from '@/lib/db';
import z from 'zod';
import getSession from './session';
import { revalidateTag } from 'next/cache';

export async function deleteComment(id: number) {
  await db.comment.delete({
    where: {
      id,
    },
  });
}

const formSchema = z.object({
  payload: z.string().trim().min(1, '댓글 내용을 입력해주세요.'),
  userId: z.number(),
  postId: z.number(),
  commentId: z.number(),
});

export default async function updateCommentAction(
  prevState: any,
  formData: FormData
) {
  const data = {
    payload: formData.get('payload'),
    postId: Number(formData.get('postId')),
    userId: Number(formData.get('userId')),
    commentId: Number(formData.get('commentId')),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      await db.comment.update({
        where: {
          id: result.data.commentId,
        },
        data: {
          payload: result.data.payload,
        },
        select: {
          id: true,
        },
      });
      console.log(result);
      revalidateTag('post-detail');
    }
  }
}
