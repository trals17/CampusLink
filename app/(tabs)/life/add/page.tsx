// app/(tabs)/life/add/page.tsx
"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import AddPost from "./actions"; // 서버 액션
import BeforePage from "@/components/BeforePage";
import Image from "next/image";

export default function AddLife() {
  return (
    <div className="p-5">
      <BeforePage />

      {/* 서버 액션 AddPost를 직접 연결: method="post"를 반드시 넣어야 합니다 */}
      <form className="flex flex-col gap-4" action={AddPost} method="post">
        <div className="flex flex-row justify-center items-center gap-2 mb-4">
          <h1 className="text-center text-xl p-2">이야기를 들려주세요</h1>
          <Image src="/img-mascot.png" alt="운동" width={50} height={50} />
        </div>

        <div className="flex gap-2 flex-col">
          <h1>제목을 입력하세요</h1>
          <Input type="text" name="title" required />
        </div>

        <div className="flex gap-2 flex-col">
          <h1>내용을 입력하세요</h1>
          <Input type="text" name="description" required />
        </div>

        {/* 
          Button 컴포넌트가 내부적으로 <button>을 렌더링한다고 가정.
          기본 type이 "button"일 수 있으니 반드시 type="submit" 추가. 
        */}
        <Button type="submit" text="저장" />
      </form>
    </div>
  );
}
