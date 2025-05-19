'use client';

import { InitialProducts } from '@/app/(tabs)/home/page';
import ListProduct from './list-product';
import { useEffect, useRef, useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/home/actions';
import { revalidateTag } from 'next/cache';
import { ProductStatus } from '@/lib/utils';

interface ProductListProps {
  initialProducts: InitialProducts;
}
export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(
    initialProducts.map((product) => ({
      ...product,
      status: product.status as keyof typeof ProductStatus,
    }))
  );

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  const fetchProducts = async () => {
    const newProducts = await getMoreProducts(0);
    const updatedProducts = newProducts.map((product) => ({
      ...product,
      status: product.status as keyof typeof ProductStatus, // status 변환
    }));
    setProducts(updatedProducts); // 상태 업데이트
  };
  useEffect(() => {
    fetchProducts();
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);

          if (newProducts.length !== 0) {
            setProducts((prev) => [
              ...prev,
              ...newProducts.map((product) => ({
                ...product,
                status: product.status as keyof typeof ProductStatus,
              })),
            ]);
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
