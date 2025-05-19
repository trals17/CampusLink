import { getStreamVideo } from '@/app/streams/[id]/action';
import { notFound } from 'next/navigation';

interface IStreamVideoProps {
  stream_id: string;
}

interface Video {
  uid: string;
  thumbnail: string;
  readyToStream: boolean;
  readyToStreamAt: string | null;
  created: string;
  duration: number; // Duration in seconds
  preview: string;
}

interface VideoResponse {
  result: Video[];
  success: boolean;
  errors: any[];
  messages: any[];
}

export default async function LiveStreamingVideos({
  stream_id,
}: IStreamVideoProps) {
  const streamVideo: VideoResponse = await getStreamVideo(stream_id);
  if (!streamVideo) {
    return notFound();
  }

  // 비디오 리스트를 최근 날짜 기준으로 정렬
  const videos: Video[] = streamVideo.result;
  videos.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  // 최신 비디오 하나만 선택
  const latestVideo = videos[0];

  return (
    <div className="relative w-full h-full mb-10 mt-2 aspect-video">
      {latestVideo ? (
        <>
          <iframe
            src={latestVideo.preview}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            className="w-full h-full object-cover"
            style={{ position: 'relative', zIndex: 1 }}
          ></iframe>
          <div className="p-2 text-white flex flex-row justify-between *:text-sm">
            <p className="mb-2">
              <span className="bg-orange-400 rounded-full px-2 py-1 bg-opacity-40 break-all">
                방송 시간 : {new Date(latestVideo.created).toLocaleString()}
              </span>
            </p>
            <p>
              <span className="bg-orange-400 rounded-full px-2 py-1 bg-opacity-40 break-all">
                {Math.floor(latestVideo.duration / 60)}분{' '}
                {Math.floor(latestVideo.duration % 60)}초
              </span>
            </p>
          </div>
        </>
      ) : (
        <p>No recorded videos available</p>
      )}
    </div>
  );
}
