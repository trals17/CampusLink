'use client';

import { any } from 'zod';

export default function HackedComponent({}: any) {
  return (
    <>
      <h1>해커들</h1>
    </>
  );
}

//이 컴포넌트의 소스 코드가 브라우저에 표시된다는 뜻 0--> client로 데이터가 노출되지 않기를 원함
