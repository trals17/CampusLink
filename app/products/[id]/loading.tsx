import { PhotoIcon } from '@heroicons/react/24/solid';

export default function Loading() {
  return (
    <>
      <div className="animate-pulse p-5 flex flex-col gap-5">
        <div className="aspect-square border-neutral-700 border-4 border-dashed rounded-lg flex justify-center items-center text-neutral-700">
          <PhotoIcon className="size-32" />
        </div>
        <div className="flex gap-2 items-center">
          <div className="size-20 rounded-full bg-neutral-700" />
          <div className="flex flex-col gap-2">
            <div className="w-40 h-6 bg-neutral-700 rounded-lg" />
            <div className="w-20 h-6 bg-neutral-700 rounded-lg" />
          </div>
        </div>
        <div className="w-85 h-6 bg-neutral-700 rounded-lg" />
      </div>
    </>
  );
}
