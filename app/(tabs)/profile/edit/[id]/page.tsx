import EditProfile from '@/components/EditProfile';
import db from '@/lib/db';
import { notFound } from 'next/navigation';

async function getProfile(id: number) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });
  return user;
}

export default async function ProfileEdit({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const user = await getProfile(id);

  if (!user) {
    return notFound();
  }

  return (
    <>
      <EditProfile user={user} />
    </>
  );
}
