'use server';

import { IProduct } from '@/components/createChatRoom';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { ProductStatus } from '@/lib/utils';
import { redirect } from 'next/navigation';
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from 'next/cache';

export async function UpdateProduct(
  id: number,
  newStatus: keyof typeof ProductStatus
) {
  await db.product.update({
    where: {
      id,
    },
    data: {
      status: newStatus,
    },
  });
}

export async function createRoom(productId: number, product: IProduct) {
  const session = await getSession();

  const existingRoom = await db.chatRoom.findFirst({
    where: {
      productId: productId,
      users: {
        some: {
          id: session.id,
        },
      },
    },
  });

  if (existingRoom) {
    redirect(`/chats/${existingRoom.id}`);
  }

  const newRoom = await db.chatRoom.create({
    data: {
      productId: productId,
      users: {
        connect: [{ id: session.id }, { id: product.userId }],
      },
    },
  });

  redirect(`/chats/${newRoom.id}`);
}

interface IReviewCreate {
  productId: number;
  userId: number;
  userRating: string;
  detailRating: string;
}

export const ReviewCreate = async ({
  productId,
  userId,
  userRating,
  detailRating,
}: IReviewCreate) => {
  await db.review.create({
    data: {
      productId,
      userId,
      userRating,
      detailRating,
    },
  });
  redirect('/home');
};
