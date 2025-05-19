'use server';

import z from 'zod';
import getSession from '@/lib/session';
import db from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

const productSchema = z.object({
  photo: z.string({
    required_error: 'Photo is required',
  }),
  title: z.string({
    required_error: 'Title is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  price: z.coerce.number({
    required_error: 'Price is required',
  }),
  id: z.coerce.number(),
});

export default async function EditAction(prevState: any, formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
    id: formData.get('id'),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const updateProduct = await db.product.update({
        where: {
          id: result.data.id,
        },
        data: {
          title: result.data.title,
          photo: result.data.photo,
          price: result.data.price,
          description: result.data.description,
        },
        select: {
          id: true,
        },
      });

      console.log(result);
      revalidateTag('products-page');
      revalidateTag('product-title');
      revalidateTag('product-detail');

      redirect(`/products/${updateProduct.id}`);
    }
  }
}
