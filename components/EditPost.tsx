// components/EditPost.tsx
"use client";

import Input from "./input";
import Button from "./button";
import EditPostAction from "@/app/posts/[id]/edit/actions";
import Image from "next/image";

interface IPost {
  post: {
    id: number;
    title: string;
    description?: string | null;
  };
}

export default function EditPostComponent({ post }: IPost) {
  return (
    <div className="p-5">
      <form
        className="flex flex-col gap-4"
        action={EditPostAction}
        method="post"
      >
        <div className="flex flex-row justify-center items-center gap-2 mb-4">
          <h1 className="text-center text-xl p-2">다시 작성할게요</h1>
          <Image src="/img-mascot.png" alt="운동" width={50} height={50} />
        </div>

        {/* 1) 숨겨진 id 필드 */}
        <input type="hidden" name="id" value={post.id.toString()} />

        {/* 2) 제목 입력 */}
        <div className="flex gap-2 flex-col">
          <h1>제목을 입력하세요</h1>
          <Input type="text" name="title" defaultValue={post.title} required />
        </div>

        {/* 3) 내용 입력 */}
        <div className="flex gap-2 flex-col">
          <h1>내용을 입력하세요</h1>
          <Input
            type="text"
            name="description"
            defaultValue={post.description ?? ""}
            required
          />
        </div>

        {/* 4) type="submit"을 지정해야 폼이 전송됩니다 */}
        <Button type="submit" text="저장" />
      </form>
    </div>
  );
}
