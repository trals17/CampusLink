// app/api/auth/github/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!, // Vercel env 세팅 확인 필요
    scope: "read:user,user:email",
    allow_signup: "true",
  };
  const finalUrl = `${baseURL}?${new URLSearchParams(params)}`;

  return NextResponse.redirect(finalUrl);
}
