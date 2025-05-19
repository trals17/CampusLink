'use server';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

export const logOut = async () => {
  const session = await getSession();
  session.destroy();
  redirect('/');
};

export const getId = async () => {
  const id = await getSession();
  return id.id!;
};

export default async function DeleteUser(id: number) {
  await db.user.delete({
    where: { id },
  });

  // 11. 세션 종료
  const session = await getSession();
  session.destroy();

  // 12. 리다이렉트
  redirect('/');
}
