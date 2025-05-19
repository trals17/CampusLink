import ChatMessageList from '@/components/chat-message';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from 'next/cache';

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      status: true,
      photo: true,
      price: true,
      id: true,
      userId: true,
    },
  });
  return product;
}

async function getReview(productId: number) {
  const review = await db.review.findMany({
    where: {
      productId,
    },
    select: {
      id: true,
    },
  });

  return review;
}

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true, username: true },
      },
      product: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}
export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
      avatar: true,
      id: true,
    },
  });
  return user;
}

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  const product = await getProduct(room.productId);

  const seller = user.username;
  const sellerId = user.id;

  const initialMessages = await getMessages(params.id);
  const session = await getSession();

  const buyer =
    room.users.filter((user) => user.username !== seller)[0]?.username || '';

  const buyerId = room.users.filter((user) => user.id !== sellerId)[0]?.id || 0;

  const review = await getReview(product?.id!);

  return (
    <ChatMessageList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      initialMessages={initialMessages!}
      buyer={buyer}
      product={product!}
      sellerId={sellerId}
      buyerId={buyerId}
      review={review}
    />
  );
}
