import DeleteStreamBtn from '@/components/DeleteStreamBtn';
import LiveStreamChat from '@/components/LiveStreamChat';
import LiveStreamingVideos from '@/components/LiveStreamingVideos';
import db from '@/lib/db';
import getSession from '@/lib/session';
import {
  HandRaisedIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      description: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return stream;
}

async function checkStreamStatus(streamId: string) {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_TOKEN) {
    console.error('Cloudflare environment variables are not defined');
    return 'unknown';
  }

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
    return 'unknown'; // 오류 발생 시 'unknown' 상태로 설정
  }

  const data = await response.json();
  console.log('API 응답 데이터:', data);

  if (data && data.result) {
    const status = data.result.status?.current?.state;
    console.log('Stream 상태 데이터:', status);

    // status가 없을 경우 '준비중' 상태로 반환
    if (!status) {
      console.log('No current state found, defaulting to 준비중');
      return '준비중';
    }
    return status;
  } else {
    console.error('No result found in API response:', data);
    return 'unknown'; // 결과가 없을 시에도 'unknown' 상태로 설정
  }
}

export default async function StreamDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const stream = await getStream(id);
  if (!stream) {
    return notFound();
  }

  const streamStatus = await checkStreamStatus(stream.stream_id);
  const session = await getSession();

  return (
    <>
      <div className="p-5">
        {streamStatus === 'connected' ? (
          <div className="flex flex-row items-center">
            <VideoCameraIcon className="h-7 w-7 text-red-600" />
            <h1 className="text-white text-2xl p-3">Live</h1>
          </div>
        ) : streamStatus === 'disconnected' ? (
          <div className="flex flex-row items-center gap-3">
            <VideoCameraSlashIcon className="h-7 w-7 text-red-600" />
            <h1 className="text-2xl">라이브가 종료되었습니다.</h1>
          </div>
        ) : streamStatus === '준비중' ? (
          <div className="flex flex-row items-center gap-3">
            <HandRaisedIcon className="h-7 w-7 text-yellow-400" />
            <h1 className="text-2xl">잠시만 기다려주세요!</h1>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-3">
            <HandRaisedIcon className="h-7 w-7 text-yellow-400" />
            <h1 className="text-2xl">상태를 알 수 없습니다.</h1>
          </div>
        )}

        <div className="relative aspect-video">
          {streamStatus === 'connected' ? (
            <iframe
              src={`https://${process.env.CLOUDFLARE_DOMAIN}/${stream.stream_id}/iframe`}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              className="w-full h-full rounded-md"
            ></iframe>
          ) : streamStatus === 'disconnected' ? (
            <LiveStreamingVideos stream_id={stream.stream_id} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-xl">아직 스트리밍 전입니다.</h1>
            </div>
          )}
        </div>

        <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            {stream.user.avatar ? (
              <Image
                src={`${stream.user.avatar}/avatar`}
                alt={stream.user.username}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon className="w-10 h-10 text-gray-500" />
            )}
          </div>
          <div>
            <h3>{stream.user.username}</h3>
          </div>
        </div>

        <div className="py-5 flex flex-row justify-between items-center">
          <h1 className="text-3xl font-semibold">{stream.title}</h1>
          {stream.userId === session.id && (
            <DeleteStreamBtn id={id} streamId={stream.stream_id} />
          )}
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-5 bg-neutral-800 p-4 rounded-lg shadow-lg">
          {stream.description}
        </p>

        {stream.userId === session.id ? (
          <div className="bg-yellow-200 text-black p-5 rounded-md">
            <div className="flex flex-wrap">
              <span className="font-semibold">Stream URL:</span>
              <span className="break-all">
                rtmps://live.cloudflare.com:443/live/
              </span>
            </div>
            <div className="flex flex-wrap mt-2">
              <span className="font-semibold">Secret Key:</span>
              <span className="break-all">{stream.stream_key}</span>
            </div>
          </div>
        ) : null}

        <div>
          <LiveStreamChat id={id} />
        </div>
      </div>
    </>
  );
}
