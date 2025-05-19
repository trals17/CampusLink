import db from '@/lib/db';
import getSession from '@/lib/session';
import LeaveForm from '@/components/LeaveForm';

async function getUser(id: number) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      username: true,
    },
  });
  return user;
}

export default async function Leave() {
  const session = await getSession();
  const user = await getUser(session.id!);

  return (
    <>
      <LeaveForm user={user!} id={session.id!} />
    </>
  );
}
