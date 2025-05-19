import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Prisma } from '@prisma/client';
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from 'next/cache';
import Link from 'next/link';

const getCachedProducts = nextCache(getInitialProducts, ['home-products'], {
  tags: ['products-page'],
});

export const metadata = {
  title: 'Home',
};

async function getInitialProducts() {
  console.log('hit');
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
      status: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCachedProducts();

  return (
    <div className="mb-24">
      <ProductList initialProducts={initialProducts} />

      <Link
        href="/products/add"
        shallow
        className="bg-red-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-red-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
