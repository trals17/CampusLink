"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import { Vonage } from "@vonage/server-sdk";
import { Auth as VonageAuth } from "@vonage/auth";
import db from "@/lib/db";
import getSession from "@/lib/session";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: { token: token.toString() },
    select: { id: true },
  });
  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");

async function getToken(): Promise<string> {
  const t = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token: t },
    select: { id: true },
  });
  return exists ? getToken() : t;
}

export async function smsLogIn(
  prevState: { token: boolean },
  formData: FormData
) {
  const phone = formData.get("phone");
  const tokenInput = formData.get("token");

  // 1) 전화번호 입력 → 토큰 생성 후 SMS 발송
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return { token: false, error: result.error.flatten() };
    }
    // E.164 포맷으로 변환
    const phoneNumber = result.data.startsWith("0")
      ? "+82" + result.data.slice(1)
      : result.data;

    // 이전 토큰 삭제
    await db.sMSToken.deleteMany({
      where: { user: { phone: phoneNumber } },
    });

    const token = await getToken();
    // DB에 토큰 저장
    await db.sMSToken.create({
      data: {
        token,
        user: {
          connectOrCreate: {
            where: { phone: phoneNumber },
            create: {
              username: crypto.randomBytes(5).toString("hex"),
              phone: phoneNumber,
            },
          },
        },
      },
    });

    // Vonage 인증 객체 + 클라이언트 생성
    const credentials = new VonageAuth({
      apiKey: process.env.VONAGE_API_KEY as string,
      apiSecret: process.env.VONAGE_API_SECRET as string,
    });
    const vonage = new Vonage(credentials);

    // SMS 전송
    await vonage.sms.send({
      to: phoneNumber,
      from: process.env.VONAGE_SMS_FROM as string,
      text: `Your verification code is: ${token}`,
    });

    return { token: true };
  }

  // 2) 토큰 검증 단계
  const result = await tokenSchema.safeParseAsync(tokenInput);
  if (!result.success) {
    return { token: true, error: result.error.flatten() };
  }

  const record = await db.sMSToken.findUnique({
    where: { token: result.data.toString() },
    select: { id: true, userId: true },
  });
  if (!record) {
    return { token: true, error: { formErrors: ["Invalid token"] } };
  }

  // 로그인 세션 설정
  const session = await getSession();
  session.id = record.userId;
  await session.save();

  // 사용된 토큰 삭제
  await db.sMSToken.delete({ where: { id: record.id } });

  // 완료 후 리다이렉트
  return redirect("/home");
}
