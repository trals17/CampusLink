import { formatToTimeAgo, formatToWon, ProductStatus } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  status: keyof typeof ProductStatus; // Status must match the enum keys
}

export default function ListProduct({
  status,
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  // Ensure that status is properly mapped to the display value
  const displayedStatus = ProductStatus[status]; // Map directly to the enum

  return (
    <>
      {status === 'SOLD_OUT' ? null : (
        <>
          <Link href={`/products/${id}`} className="flex gap-5">
            <div className="relative size-28 rounded-md overflow-hidden">
              <Image
                fill
                priority
                src={`${photo}/avatar`}
                className="object-cover"
                alt={title}
              />
            </div>
            <div className="flex flex-col *:text-white">
              <div className="flex flex-col gap-2">
                <span className="text-lg">{title}</span>
                <span className="text-sm text-neutral-500">
                  {formatToTimeAgo(created_at.toString())}
                </span>

                <div className="flex flex-row items-center gap-2">
                  {status === 'RESERVED' ? (
                    <span className="rounded-full px-2 py-1 text-sm bg-orange-500">
                      {displayedStatus}
                    </span>
                  ) : null}
                  <span className="text-md font-semibold">
                    {formatToWon(price)}원
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </>
      )}
    </>
  );
}
