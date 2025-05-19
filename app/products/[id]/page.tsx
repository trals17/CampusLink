import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToWon, ProductStatus } from '@/lib/utils';
import { SunIcon, UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';
import StatusSelector from '@/components/statusSelector';
import CreateChatRoom from '@/components/createChatRoom';
import BeforePage from '@/components/BeforePage';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }

  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail'],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      status: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title'],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const onDelete = async () => {
    'use server';
    await db.product.delete({
      where: {
        id,
      },
    });
    revalidateTag('product-detail');
    redirect('/home');
  };

  const handleStatusChange = async (newStatus: keyof typeof ProductStatus) => {
    'use server';
    await db.product.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidateTag('product-detail');
    redirect(`/products/${id}`); // Redirect to the updated product page
  };

  return (
    <>
      <div className="mb-20">
        <BeforePage />
        <div className="relative aspect-square mt-10">
          <Image
            className="object-cover"
            fill
            src={`${product.photo}/public`}
            alt={product.title}
          />
        </div>
        <div className="p-5 flex items-center gap-3 border-b border-neutral-600">
          <div className="size-10 rounded-full">
            {product.user.avatar !== null ? (
              <Image
                className="rounded-full aspect-square"
                src={`${product.user.avatar}/public`}
                alt={product.title}
                width={45}
                height={45}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h3>{product.user.username}</h3>
          </div>
        </div>
        <div className="p-5">
          {isOwner ? (
            <StatusSelector
              productId={id}
              initialStatus={product.status as keyof typeof ProductStatus}
              onStatusChange={handleStatusChange} // here is the implemented function
            />
          ) : (
            <h3
              className="p-2 w-16 text-sm text-center
            rounded-full bg-orange-500 text-white mb-4"
            >
              {ProductStatus[product.status as keyof typeof ProductStatus]}
            </h3>
          )}
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p>{product.description}</p>
        </div>
        <div
          className="
    mx-auto max-w-screen-sm w-full
    fixed bottom-0 left-1/2 transform -translate-x-1/2 p-5 bg-neutral-800 flex justify-between items-center"
        >
          <span className="font-semibold text-lg">
            {formatToWon(product.price)}원{' '}
          </span>
          {isOwner ? (
            <form action={onDelete}>
              <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                삭제하기
              </button>
            </form>
          ) : null}
          {isOwner ? (
            <Link
              className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
              href={`/products/${id}/edit`}
            >
              수정하기
            </Link>
          ) : null}
          {isOwner ? null : (
            <>
              <CreateChatRoom product={product} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });

  return products.map((product) => {
    return {
      id: product.id + '',
    };
  });
}
