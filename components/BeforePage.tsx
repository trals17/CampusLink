'use client';

import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function BeforePage() {
  const router = useRouter();

  const onClick = () => {
    return router.back();
  };

  return (
    <>
      <div className="m-3 pb-2">
        <button
          onClick={onClick}
          className="flex justify-start absolute top-4 left-4"
        >
          <ChevronLeftIcon className="size-7 " />
        </button>
      </div>
    </>
  );
}
