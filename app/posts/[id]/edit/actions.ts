'use server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import z from 'zod';

const formSchema = z.object({
  title: z
    .string({
      required_error: '제목을 입력해주세요. ',
    })
    .trim(),
  description: z
    .string({
      required_error: '내용을 입력해주세요. ',
    })
    .trim(),
  id: z.coerce.number(),
  //z.coerce.number()는 Zod 라이브러리에서 제공하는 메서드로, 입력값을 숫자로 강제 변환(coerce)하는 기능
});

export default async function EditPostAction(
  prevState: any,
  formData: FormData
) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    id: formData.get('id'),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    await db.post.update({
      where: {
        id: result.data.id,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
      },
    });
    redirect(`/posts/${result.data.id}`);
  }
}
