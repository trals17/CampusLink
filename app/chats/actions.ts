'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { revalidateTag } from 'next/cache';

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  const message = await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
      isRead: false,
    },
    select: {
      id: true,
    },
  });
  //revalidateTag('chat-message');
}

export async function markMessagesAsRead(chatRoomId: string, userId: number) {
  await db.message.updateMany({
    where: {
      chatRoomId,
      userId: {
        not: userId,
      },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
  //revalidateTag('chat-message');
}
