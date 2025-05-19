'use client';

import Loading from '@/app/products/add/loading';
import { useFormStatus } from 'react-dom';

interface IButton {
  text: string;
}

export default function Button({ text }: IButton) {
  const { pending } = useFormStatus();

  // pending 상태일 때 Loading 컴포넌트만 보여줌
  if (pending) {
    return <Loading />;
  }
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {text}
    </button>
  );
}
