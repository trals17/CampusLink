'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';
import z from 'zod';

const profileSchema = z.object({
  username: z.string({
    required_error: 'username is required',
  }),
  avatar: z.string({
    required_error: 'avatar is required',
  }),
  id: z.string(),
});

export default async function EditProfileAction(
  prevState: any,
  formData: FormData
) {
  const data = {
    username: formData.get('username'),
    avatar: formData.get('avatar'),
    id: formData.get('id'),
  };

  const result = profileSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    const id = Number(result.data.id);

    if (session.id) {
      // 업데이트할 데이터를 data 객체에 포함시켜야 합니다.
      const updateProfile = await db.user.update({
        where: {
          id: id,
        },
        data: {
          username: result.data.username,
          avatar: result.data.avatar,
        },
        select: {
          id: true,
        },
      });
      redirect(`/profile`);
    }
  }
}
