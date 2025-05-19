'use client';

import Link from 'next/link';
import {
  HomeIcon as OutlineHomeIcon,
  FireIcon as OutlineFireIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineLiveIcon,
  UserIcon as OutlineUserIcon,
  UserGroupIcon as OutlineUserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  FireIcon as SolidFireIcon,
  HomeIcon as SolidHomeIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  VideoCameraIcon as SolidLiveIcon,
  UserIcon as SolidUserIcon,
  UserGroupIcon as SoildUserGroupIcon,
} from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';

export default function TabBar() {
  const pathname = usePathname();
  return (
    <>
      <div className="fixed bottom-0 w-full mx-auto max-w-screen-sm grid grid-cols-5 border-neutral-600 border-t-2 px-5 py-3 *:text-white bg-neutral-800">
        <Link href="/home" className="flex flex-col items-center gap-px">
          {pathname === '/home' ? (
            <SolidHomeIcon className="size-7 text-yellow-600" />
          ) : (
            <OutlineHomeIcon className="size-7" />
          )}
          <span>홈</span>
        </Link>
        <Link href="/life" className="flex flex-col items-center gap-px">
          {pathname === '/life' ? (
            <SoildUserGroupIcon className="size-7 text-yellow-600" />
          ) : (
            <OutlineUserGroupIcon className="size-7" />
          )}
          <span>운동감자</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-px">
          {pathname === '/chat' ? (
            <SolidChatIcon className="size-7 text-yellow-600" />
          ) : (
            <OutlineChatIcon className="size-7" />
          )}
          <span>채팅</span>
        </Link>
        <Link href="/live" className="flex flex-col items-center gap-px">
          {pathname === '/live' ? (
            <SolidFireIcon className="size-7 text-yellow-600" />
          ) : (
            <OutlineFireIcon className="size-7" />
          )}
          <span>운동중</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-px">
          {pathname === '/profile' ? (
            <SolidUserIcon className="size-7 text-yellow-600" />
          ) : (
            <OutlineUserIcon className="size-7" />
          )}
          <span>나의 감자</span>
        </Link>
      </div>
    </>
  );
}
