import db from '@/lib/db';
import getSession from '@/lib/session';
import LiveStreamMessageForm from './LiveStreamMessageForm';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';

async function getLiveStream(id: number) {
  return await db.liveStream.findUnique({
    where: { id },
    select: { userId: true },
  });
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

async function getLiveStreamChat(id: number) {
  const liveStreamChat = await db.liveChatMessage.findMany({
    where: {
      streamId: id,
    },
    select: {
      payload: true,
      userId: true,
      created_at: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return liveStreamChat;
}

// InitialChatMessages 타입 정의
export type InitialChatMessages = Prisma.PromiseReturnType<
  typeof getLiveStreamChat
>;

// LiveStreamChat 컴포넌트
export default async function LiveStreamChat({ id }: { id: number }) {
  const liveStreamChat = await getLiveStreamChat(id);
  const liveStream = await getLiveStream(id);
  const session = await getSession();

  if (!liveStreamChat || !liveStream) {
    return notFound();
  }

  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <div className="mt-5">
      <LiveStreamMessageForm
        id={id}
        initialMessages={liveStreamChat!}
        userId={liveStream.userId}
        username={user.username}
        avatar={user.avatar!}
      />
    </div>
  );
}
