import BeforePage from '@/components/BeforePage';
import Button from '@/components/button';
import EditPostComponent from '@/components/EditPost';
import Input from '@/components/input';
import db from '@/lib/db';
import { GlobeAsiaAustraliaIcon } from '@heroicons/react/24/solid';
import { notFound } from 'next/navigation';

async function getPost(id: number) {
  const post = await db.post.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });
  return post;
}

export default async function EditPost({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    notFound();
  }

  const post = await getPost(id);
  if (!post) {
    return notFound();
  }
  return (
    <>
      <div className="p-5">
        <BeforePage />
        <EditPostComponent post={post!} />
      </div>
    </>
  );
}
