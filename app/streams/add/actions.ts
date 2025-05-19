'use server';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';
import { record, z } from 'zod';

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function startStream(_: any, formData: FormData) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
  };

  const results = formSchema.safeParse(data);
  if (!results.success) {
    return results.error.flatten();
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
      body: JSON.stringify({
        meta: {
          name: results.data.title,
        },
        recording: {
          mode: 'automatic',
        },
      }),
    }
  );
  const fetchData = await response.json();
  console.log(fetchData);
  const session = await getSession();
  const stream = await db.liveStream.create({
    data: {
      title: results.data.title,
      description: results.data.description,
      stream_id: fetchData.result.uid,
      stream_key: fetchData.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
  redirect(`/streams/${stream.id}`);
}
