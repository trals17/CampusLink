import { redirect } from 'next/navigation';
import getSession from './session';

export async function Auth(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
  return redirect('/profile');
}
