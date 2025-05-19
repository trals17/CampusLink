import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import {
  BellAlertIcon,
  ClipboardDocumentListIcon,
  FaceFrownIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  ChevronRightIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { logOut } from './leave/actions';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound(); //session에 ID가 없을 때 실행된다.
}

async function getUserProduct(id: number) {
  const userProduct = await db.product.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      price: true,
      title: true,
      created_at: true,
      photo: true,
    },
  });
  return userProduct;
}

export default async function Profile() {
  const user = await getUser();
  const userProduct = await getUserProduct(user.id);

  return (
    <div className="p-5 flex flex-col gap-8">
      <div className="flex flex-row items-center gap-2">
        <Image
          src="/기본감자.png"
          alt="운동감자"
          width={80}
          height={80}
          className="pl-2"
        />
        <h1 className="text-center text-3xl">
          나의 <strong className="text-yellow-600">운동감자</strong> 생활
        </h1>
      </div>
      <div className="flex justify-between items-center border-2 border-opacity-30 rounded-xl px-5 py-3">
        <div className="flex flex-row items-center gap-3 rounded-full">
          <Image
            src={`${user.avatar}/public`}
            alt={user.username}
            className="rounded-full object-cover aspect-square"
            width={60}
            height={60}
          />
          <h1 className="text-xl">{user.username}</h1>
        </div>
        <Link href={`/profile/edit/${user.id}`}>
          <ChevronRightIcon className="size-6 text-white" />
        </Link>
      </div>
      <div
        className="p-5 border-2 rounded-xl
      *:text-white flex flex-row justify-around"
      >
        <Link
          href={`/profile/product`}
          className="flex flex-col items-center gap-2"
        >
          <ClipboardDocumentListIcon className="size-8" />
          <h1>판매 내역</h1>
        </Link>
        <Link
          href={`/profile/life`}
          className="flex flex-col items-center gap-2"
        >
          <PencilSquareIcon className="size-8" />
          <h1>내가 쓴 글</h1>
        </Link>
        <Link
          href={`/profile/live`}
          className="flex flex-col items-center gap-2"
        >
          <BellAlertIcon className="size-8" />
          <h1>나의 라이브</h1>
        </Link>
      </div>
      <Link
        href="/profile/review"
        className="flex flex-row justify-center items-stretch gap-2 border-2 border-opacity-30 rounded-xl px-5 py-3"
      >
        <HandThumbUpIcon className="size-6 text-red-600" />
        <h1 className="text-lg text-white">내가 받은 리뷰 보러가기</h1>
        <HandThumbDownIcon className="size-6 text-red-600" />
      </Link>

      <div className=" flex flex-row items-center justify-around border-2 rounded-xl p-3">
        <form action={logOut} className="flex flex-row gap-3">
          <FaceFrownIcon className="size-8 *:text-red-500" />
          <button>로그아웃</button>
        </form>
        <Link
          href={'/profile/leave'}
          className="flex flex-row items-center gap-3"
        >
          <ExclamationTriangleIcon className="size-8 text-red-500" />
          <h1 className="text-white">탈퇴하기</h1>
        </Link>
      </div>
    </div>
  );
}
