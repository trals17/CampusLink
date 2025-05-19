'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';

export async function getStreamVideo(input_UID: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${input_UID}/videos`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

export async function deleteStream(input_UID: string, id: number) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${input_UID}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete stream from Cloudflare: ${response.statusText}`
      );
    }

    await db.liveStream.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error('Error deleting stream:', error);
    // 추가적인 에러 처리 로직
  }
}

export async function saveLiveChatMessage(payload: string, streamId: number) {
  const session = await getSession();
  const message = await db.liveChatMessage.create({
    data: {
      payload,
      streamId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
}
