"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

const profileSchema = z.object({
  username: z.string().nonempty("username is required"),
  avatar: z.string().nonempty("avatar is required"),
  id: z.string(),
});

export default async function EditProfileAction(formData: FormData) {
  // 1) FormData에서 값 꺼내기
  const raw = {
    username: formData.get("username")?.toString(),
    avatar: formData.get("avatar")?.toString(),
    id: formData.get("id")?.toString(),
  };

  // 2) Zod 검증
  const result = profileSchema.safeParse(raw);
  if (!result.success) {
    return result.error.flatten();
  }

  // 3) 세션 체크
  const session = await getSession();
  if (!session.id) {
    throw new Error("Unauthorized");
  }

  // 4) DB 업데이트
  const id = Number(result.data.id);
  await db.user.update({
    where: { id },
    data: {
      username: result.data.username,
      avatar: result.data.avatar,
    },
  });

  // 5) 완료 후 리다이렉트
  redirect("/profile");
}
