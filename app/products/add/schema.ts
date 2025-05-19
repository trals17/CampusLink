//프론트, 백 둘다 schema를 사용하기 위해서 따로 schema.ts 파일을 생성함

import z from 'zod';

export const productSchema = z.object({
  photo: z.string({
    required_error: 'photo is required',
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
});

export type ProductType = z.infer<typeof productSchema>;
