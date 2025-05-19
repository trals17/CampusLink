'use server';

import db from '@/lib/db';

export async function getStreams() {
  const streams = await db.liveStream.findMany({
    select: {
      created_at: true,
      title: true,
      description: true,
      stream_id: true,
      id: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return streams;
}

export async function checkStreamStatus(streamId: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${streamId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    console.error('Failed to fetch stream status');
    return 'unknown';
  }

  const data = await response.json();
  console.log('API 응답 데이터:', data);

  if (data && data.result) {
    console.log('Stream 상태 데이터:', data.result.status);
    const status = data.result.status?.current?.state;
    console.log(status);
    return status === undefined ? null : status;
  } else {
    console.error('No result found in API response:', data);
    return 'unknown';
  }
}
