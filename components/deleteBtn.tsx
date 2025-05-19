// components/DeleteCommentBtn.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteComment } from '@/lib/commentActions';

interface IDeleteCommentBtnProps {
  commentId: number;
}

export default function DeleteCommentBtn({
  commentId,
}: IDeleteCommentBtnProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteClick = async () => {
    setIsDeleting(true);

    try {
      await deleteComment(commentId);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={isDeleting}
      className="text-white text-sm"
    >
      ❌
    </button>
  );
}
