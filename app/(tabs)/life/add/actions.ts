// app/(tabs)/life/add/actions.ts
"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "내용을 입력해주세요"),
});

export default async function AddPost(formData: FormData) {
  "use server";

  // 1) FormData에서 값 꺼내기
  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  // 2) zod로 유효성 검사
  const result = formSchema.safeParse({ title, description });
  if (!result.success) {
    // useFormState에서 fieldErrors를 보여주려면 이 형태로 리턴해야 합니다.
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  // 3) 세션(로그인) 확인
  const user = await getSession();
  if (!user?.id) {
    throw new Error("로그인이 필요합니다.");
  }

  // 4) DB에 새 게시글 생성
  const newPost = await db.post.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      userId: user.id,
    },
  });

  // 5) 생성된 게시글 상세 페이지로 이동
  redirect(`/posts/${newPost.id}`);
}
