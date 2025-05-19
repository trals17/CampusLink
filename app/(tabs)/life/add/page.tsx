'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { GlobeAsiaAustraliaIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import AddPost from './actions';
import BeforePage from '@/components/BeforePage';
import Image from 'next/image';

export default function AddLife() {
  const [state, action] = useFormState(AddPost, null);
  return (
    <>
      <div className="p-5">
        <BeforePage />
        <form className=" flex flex-col gap-4" action={action}>
          <div className="flex flex-row justify-center items-center gap-2 mb-4">
            <h1 className="text-center text-xl p-2">
              운동 감자의 이야기를 들려주세요
            </h1>
            <Image src={'/main.png'} alt="운동" width={50} height={50} />
          </div>
          <div className="flex gap-2 flex-col">
            <h1>제목을 입력하세요</h1>
            <Input
              type="text"
              name="title"
              errors={state?.fieldErrors.title}
              required
            />
          </div>
          <div className="flex gap-2 flex-col">
            <h1>내용을 입력하세요</h1>
            <Input
              type="text"
              name="description"
              errors={state?.fieldErrors.description}
              required
            />
          </div>
          <Button text="저장" />
        </form>
      </div>
    </>
  );
}
