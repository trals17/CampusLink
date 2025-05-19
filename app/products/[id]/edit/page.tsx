import db from '@/lib/db';
import { notFound } from 'next/navigation';
import EditForm from '@/components/EditForm';
import BeforePage from '@/components/BeforePage';

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      photo: true,
      title: true,
      price: true,
      description: true,
      id: true,
      status: true,
    },
  });
  return product;
}

export default async function EditPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  return (
    <>
      <BeforePage />
      <EditForm product={product} />
    </>
  );
}
