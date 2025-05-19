'use client';
import { createClient } from '@supabase/supabase-js';
import { ProductStatus } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { UpdateProduct } from '@/app/products/[id]/actions';

export const SUPABASE_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubHh0ZmZxZXNrbnJxdWRudXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNDk5NTMsImV4cCI6MjA0MDgyNTk1M30.hp4xZkxE7HdtqzvoTVskCLGNi1JvaWuScQStzPsPpJk';

export const SUPABASE_URL = 'https://pnlxtffqesknrqudnusk.supabase.co';

interface IStatusSelector {
  productId: number;
  initialStatus: keyof typeof ProductStatus;
  onStatusChange: (newStatus: keyof typeof ProductStatus) => void;
}

export default function StatusSelector({
  productId,
  initialStatus,
  onStatusChange,
}: IStatusSelector) {
  const [status, setStatus] =
    useState<keyof typeof ProductStatus>(initialStatus);
  const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStatus = event.target.value as keyof typeof ProductStatus;
    setStatus(selectedStatus);
    await UpdateProduct(productId, selectedStatus);
    onStatusChange(selectedStatus);

    // 상태 변경을 브로드캐스트
    client.channel(`product-${productId}`).send({
      type: 'broadcast',
      event: 'status_change',
      payload: { status: selectedStatus },
    });

    // SOLD_OUT 상태면 새로고침
    if (selectedStatus === 'SOLD_OUT') {
      window.location.reload();
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  useEffect(() => {
    const channel = client.channel(`product-${productId}`);

    channel
      .on('broadcast', { event: 'status_change' }, (payload) => {
        console.log('Received status change:', payload);
        if (payload.payload.status === 'SOLD_OUT') {
          window.location.reload();
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [client, productId]);

  return (
    <div className="mb-3">
      <select
        value={status}
        onChange={handleStatusChange}
        className="rounded-full text-black text-sm px-2 py-1 w-20"
      >
        <option value="SALE">{ProductStatus.SALE}</option>
        <option value="RESERVED">{ProductStatus.RESERVED}</option>
        <option value="SOLD_OUT">{ProductStatus.SOLD_OUT}</option>
      </select>
    </div>
  );
}
