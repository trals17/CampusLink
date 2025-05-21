import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  // 1) 반드시 await cookies()로 CookieStore를 가져옵니다.
  const cookieStore = await cookies();

  // 2) 그 CookieStore를 getIronSession에 넘겨야 세션을 읽어올 수 있어요.
  return getIronSession<SessionContent>(cookieStore, {
    cookieName: "delicious-carrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}
