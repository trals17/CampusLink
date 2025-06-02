"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { startStream } from "./actions";
import BeforePage from "@/components/BeforePage";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);
  return (
    <>
      <div className="pt-5">
        <BeforePage />
        <h1 className="text-2xl text-center py-3 mt-5 mx-2 text-white-700 font-semibold shadow-lg ">
          <strong className="text-red-700">라이브</strong>
        </h1>

        <form
          action={action}
          className="p-8 bg-neutral-900 rounded-lg shadow-md flex flex-col gap-6 mx-auto w-full "
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-xl text-white font-semibold">
              무엇을 의뢰하시겠어요?
            </h1>
            <Input
              name="title"
              required
              placeholder="제목을 입력해주세요. "
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
              placeholder="예 ) APPLE 2025 iPad Air 13 M3"
              className="border-2 border-gray-300 rounded-md p-2  text-black"
              errors={state?.formErrors}
            />
          </div>
          <Button text="준비 완료" />
        </form>
      </div>
    </>
  );
}
