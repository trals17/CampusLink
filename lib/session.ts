import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  // cookies()를 await해서 RequestCookies를 꺼낸 다음
  const cookieStore = await cookies();

  // 그걸 getIronSession에 넘겨야 세션을 제대로 읽어옵니다
  return getIronSession<SessionContent>(cookieStore, {
    cookieName: "campuslink-cookie",
    password: process.env.COOKIE_PASSWORD!,
  });
}
