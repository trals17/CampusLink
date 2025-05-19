import BeforePage from '@/components/BeforePage';
import ProduceProfile from '@/components/ProductProfile';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { ProductStatus } from '@/lib/utils';
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

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
      status: true,
    },
  });
  return userProduct;
}

// async function getUserProductStatus(id: number, status: string) {
//   await db.product.findUnique({
//     where: {
//       id,
//       status,
//     },
//     select: {
//       id: true,
//       price: true,
//       title: true,
//       created_at: true,
//       photo: true,
//     },
//   });
// }

async function getUser(id: number) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      avatar: true,
      username: true,
    },
  });

  return user;
}

export default async function UserProduct() {
  const session = await getSession();
  const user = await getUser(session.id!);
  const userProduct = await getUserProduct(session.id!);
  return (
    <>
      <div className="p-5">
        <BeforePage />
        <div className="flex flex-row items-center justify-between border-b-2  border-neutral-600 py-5">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold">나의 판매내역</h1>
            <Link
              href="/products/add"
              className="border-2 rounded-xl text-center py-2 px-0 text-sm bg-white" // Updated padding
            >
              글쓰기
            </Link>
          </div>

          <div className="relative w-16 h-16">
            <Image
              src={`${user?.avatar}/public`}
              alt={user?.username!}
              layout="fill"
              className="object-cover rounded-full"
            />
          </div>
        </div>
        <ProduceProfile userProduct={userProduct} />
      </div>
    </>
  );
}
