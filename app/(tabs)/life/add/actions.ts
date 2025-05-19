'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';
import { describe } from 'node:test';
import z from 'zod';

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});
export default async function AddPost(prevState: any, formData: FormData) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
  };

  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await getSession();
    if (user.id) {
      await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          userId: user.id!,
        },
      });
    }
  }
  redirect('/life');
}
