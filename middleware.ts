import { url } from 'inspector';
import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

interface IRoutes {
  [key: string]: boolean;
}

const publicOnlyUrl: IRoutes = {
  '/': true,
  '/login': true,
  '/create-account': true,
  '/sms': true,
  '/github/start': true,
  '/github/complete': true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exits = publicOnlyUrl[request.nextUrl.pathname];
  if (!session.id) {
    if (!exits) {
      return Response.redirect(new URL('/', request.url));
    }
  } else {
    if (exits) {
      return Response.redirect(new URL('/home', request.url));
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

//인증된 사용자만 접근할 수 있도록 하는 미들웨어 만드는 것으로 마무리
//세션을 가져오고, 사용자가 쿠키에 id를 가지고 있는지 확인하는 것부터 시작할 것임.
