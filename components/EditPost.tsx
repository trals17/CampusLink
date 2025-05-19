'use client';

import { GlobeAsiaAustraliaIcon } from '@heroicons/react/24/solid';
import Input from './input';
import Button from './button';
import { useFormState } from 'react-dom';
import EditPostAction from '@/app/posts/[id]/edit/actions';
import Image from 'next/image';

interface IPost {
  post: {
    title: string;
    description?: string | null;
    id: number;
  };
}

export default function EditPostComponent({ post }: IPost) {
  const [state, action] = useFormState(EditPostAction, null);

  return (
    <div>
      <form className="flex flex-col gap-4" action={action}>
        <div className="flex flex-row justify-center items-center gap-2 mb-4">
          <h1 className="text-center text-xl p-2">
            운동 감자, 다시 작성할게요
          </h1>
          <Image src={'/main.png'} alt="운동" width={50} height={50} />
        </div>
        <div className="flex gap-2 flex-col">
          <h1>제목을 입력하세요</h1>
          <Input
            type="text"
            name="title"
            errors={state?.fieldErrors?.title}
            required
            defaultValue={post.title}
          />
          <Input
            type="hidden"
            name="id"
            defaultValue={post.id.toString()} // 숫자를 문자열로 변환
          />
        </div>
        <div className="flex gap-2 flex-col">
          <h1>내용을 입력하세요</h1>
          <Input
            type="text"
            name="description"
            errors={state?.fieldErrors?.description}
            required
            defaultValue={post.description ?? ''}
          />
        </div>
        <Button text="저장" />
      </form>
    </div>
  );
}
