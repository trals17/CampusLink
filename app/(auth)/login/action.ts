"use server";
import {
  PASSWORD_MIN_LENGTH,
  // PASSWORD_REGEX,
  // PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email does not exist"),
  password: z.string({ required_error: "Password is required" }),
  // .min(PASSWORD_MIN_LENGTH)
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
});

export async function login(prevState: any, formData: FormData) {
  // 1) FormData에서 값 추출
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 2) 유효성 검사 (async refine 사용 시 safeParseAsync 권장)
  const result = await formSchema.safeParseAsync({ email, password });
  if (!result.success) {
    return result.error.flatten();
  }

  // 3) 유저 조회 및 비밀번호 비교
  const user = await db.user.findUnique({
    where: { email: result.data.email },
    select: { id: true, password: true },
  });
  const ok = await bcrypt.compare(result.data.password, user?.password ?? "");
  if (!ok) {
    return {
      fieldErrors: { password: ["Wrong password"], email: [] },
    };
  }

  // 4) 세션 저장 및 리디렉션
  const session = await getSession();
  session.id = user!.id;
  await session.save();
  redirect("/profile");
}
