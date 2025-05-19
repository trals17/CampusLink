'use client';

import { deleteStream } from '@/app/streams/[id]/action';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  streamId: string;
  id: number;
}

export default function DeleteStreamBtn({ streamId, id }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteStream(streamId, id);
    router.push('/'); // Redirect after deletion
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
      <TrashIcon className="size-7" />
    </button>
  );
}
