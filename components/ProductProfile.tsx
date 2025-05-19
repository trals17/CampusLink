'use client';

import Image from 'next/image';
import { formatToTimeAgo, formatToWon, ProductStatus } from '@/lib/utils'; // Assuming you have this utility function
import Link from 'next/link';
import { useState } from 'react';

interface IProduct {
  id: number;
  photo: string;
  title: string;
  created_at: Date;
  price: number;
  status: string;
}

interface IProductProfile {
  userProduct: IProduct[];
}

export default function ProduceProfile({ userProduct }: IProductProfile) {
  const [status, setStatus] = useState<keyof typeof ProductStatus>();

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStatus = event.target.value as keyof typeof ProductStatus;
    setStatus(selectedStatus);
  };

  return (
    <>
      <div className="pt-2">
        <select
          value={status}
          className="text-sm text-black rounded-full"
          onChange={handleStatusChange}
        >
          <option value="SALE">{ProductStatus.SALE}</option>
          <option value="RESERVED">{ProductStatus.RESERVED}</option>
          <option value="SOLD_OUT">{ProductStatus.SOLD_OUT}</option>
        </select>
        {status === 'SALE' ? (
          <>
            <div className="flex flex-col gap-4 pt-3">
              {userProduct.map(
                (product) =>
                  product.status === 'SALE' && (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className="flex flex-row gap-5 py-2 *:text-white"
                    >
                      <div className="relative w-24 h-24">
                        <Image
                          src={`${product.photo}/public`}
                          alt={product.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xl">{product.title}</h2>
                        <h3 className="text-sm">
                          {formatToTimeAgo(product.created_at.toString())}{' '}
                        </h3>
                        <p>{formatToWon(product.price)}원</p>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </>
        ) : null}
        {status === 'RESERVED' ? (
          <>
            <div className="flex flex-col gap-4 pt-3">
              {userProduct.map(
                (product) =>
                  product.status === 'RESERVED' && (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className="flex flex-row gap-5 py-2 *:text-white"
                    >
                      <div className="relative w-24 h-24">
                        <Image
                          src={`${product.photo}/public`}
                          alt={product.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xl">{product.title}</h2>
                        <h3 className="text-sm">
                          {formatToTimeAgo(product.created_at.toString())}{' '}
                        </h3>
                        <p>{formatToWon(product.price)}원</p>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </>
        ) : null}
        {status === 'SOLD_OUT' ? (
          <>
            <div className="flex flex-col gap-4 pt-3">
              {userProduct.map(
                (product) =>
                  product.status === 'SOLD_OUT' && (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className="flex flex-row gap-5 py-2 *:text-white"
                    >
                      <div className="relative w-24 h-24">
                        <Image
                          src={`${product.photo}/public`}
                          alt={product.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xl">{product.title}</h2>
                        <h3 className="text-sm">
                          {formatToTimeAgo(product.created_at.toString())}{' '}
                        </h3>
                        <p>{formatToWon(product.price)}원</p>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
