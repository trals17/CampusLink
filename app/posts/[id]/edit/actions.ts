// app/posts/[id]/edit/actions.ts
"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import z from "zod";

const formSchema = z.object({
  id: z.coerce.number(),
  title: z
    .string({ required_error: "제목을 입력해주세요." })
    .trim()
    .min(1, "제목을 입력해주세요."),
  description: z
    .string({ required_error: "내용을 입력해주세요." })
    .trim()
    .min(1, "내용을 입력해주세요."),
});

export default async function EditPostAction(formData: FormData) {
  // 1) FormData에서 값 추출
  const rawId = formData.get("id")?.toString() ?? "";
  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  // 2) Zod로 검증 (id 문자열 → 숫자로 변환)
  const result = formSchema.safeParse({ id: rawId, title, description });
  if (!result.success) {
    // 유효성 검사 실패 시, { fieldErrors: … } 형태로 반환
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { id, title: validTitle, description: validDesc } = result.data;

  // 3) DB 업데이트
  await db.post.update({
    where: { id },
    data: {
      title: validTitle,
      description: validDesc,
    },
  });

  // 4) 캐시 무효화: 상세 페이지에서 nextCache에 사용한 태그 이름과 동일해야 합니다.
  revalidateTag("post-detail");

  // 5) 수정 완료 후 상세 페이지로 리다이렉트
  redirect(`/posts/${id}`);
}
