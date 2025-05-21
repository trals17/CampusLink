"use server";

import {
  PASSWORD_MIN_LENGTH,
  // 비밀번호 정규식과 에러 메시지는 필요하다면 주석 해제
  // PASSWORD_REGEX,
  // PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

// 사용자명 체크: 'potato' 포함 금지
const checkUsername = (username: string) => !username.includes("potato");

// 비밀번호 확인
const checkPassword = ({
  password,
  comfirmPassword,
}: {
  password: string;
  comfirmPassword: string;
}) => password === comfirmPassword;

// Zod 스키마 정의
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username?",
      })
      .trim()
      .toLowerCase()
      .refine(checkUsername, "No potato allowed"),
    avatar: z.string(),
    email: z
      .string({
        invalid_type_error: "Email must be a string!",
        required_error: "Where is my email?",
      })
      .email()
      .toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH, "Way too short!"),
    comfirmPassword: z.string().min(PASSWORD_MIN_LENGTH, "Way too short!"),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "Both passwords should be the same!",
    path: ["comfirmPassword"],
  });

// file: app/(auth)/create-account/action.ts
export async function createAccountAction(prevState: any, formData: FormData) {
  // 1) formData에서 각 값 꺼내기
  const avatar = formData.get("avatar") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const comfirmPassword = formData.get("comfirmPassword") as string;

  // 2) Zod 스키마로 유효성 검사
  const result = await formSchema.safeParseAsync({
    avatar,
    username,
    email,
    password,
    comfirmPassword,
  });
  if (!result.success) {
    return result.error.flatten();
  }

  // 3) 비밀번호 해싱 및 DB 저장
  const hashedPassword = await bcrypt.hash(result.data.password, 12);
  const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
      avatar: result.data.avatar, // full URL이 저장됩니다
    },
    select: { id: true },
  });

  // 4) 세션에 사용자 ID 저장
  const session = await getSession();
  session.id = user.id;
  await session.save();

  // 5) 프로필 페이지로 리디렉트
  redirect("/profile");
}
