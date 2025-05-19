'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { startStream } from './actions';
import BeforePage from '@/components/BeforePage';

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);
  return (
    <>
      <div className="pt-5">
        <BeforePage />
        <h1 className="text-2xl text-center py-3 mt-5 mx-2 text-white-700 font-semibold shadow-lg ">
          <strong className="text-red-700">운동감자</strong>가 될 시간입니다.
        </h1>

        <form
          action={action}
          className="p-8 bg-neutral-900 rounded-lg shadow-md flex flex-col gap-6 mx-auto w-full "
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-xl text-white font-semibold">
              오늘의 운동은 어디인가요?
            </h1>
            <Input
              name="title"
              required
              placeholder="운동 제목을 입력해주세요. "
              className="border-2 border-gray-300 rounded-md p-2 text-black"
              errors={state?.formErrors}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl text-white font-semibold">
              간단한 설명 부탁드려요
            </h1>
            <Input
              name="description"
              required
              placeholder="예 ) 오늘은 후면 하체 데이"
              className="border-2 border-gray-300 rounded-md p-2  text-black"
              errors={state?.formErrors}
            />
          </div>
          <Button text="운동감자 준비 완료" />
        </form>
      </div>
    </>
  );
}
