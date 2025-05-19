'use client';
import { InitialChatMessages } from '@/app/chats/[id]/page';
import { markMessagesAsRead, saveMessage } from '@/app/chats/actions';
import {
  formatToDayAndTime,
  formatToTime,
  formatToWon,
  ProductStatus,
} from '@/lib/utils';
import { ArrowUpCircleIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import StatusSelector from './statusSelector';
import ReviewForm from './reviewForm';
import BeforePage from './BeforePage';

export const SUPABASE_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubHh0ZmZxZXNrbnJxdWRudXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNDk5NTMsImV4cCI6MjA0MDgyNTk1M30.hp4xZkxE7HdtqzvoTVskCLGNi1JvaWuScQStzPsPpJk';

export const SUPABASE_URL = 'https://pnlxtffqesknrqudnusk.supabase.co';

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
  buyer: string;
  product: {
    title: string;
    status: string;
    photo: string;
    price: number;
    id: number;
    userId: number;
  };
  sellerId: number;
  buyerId: number;
  review: { id: number }[];
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
  buyer,
  product,
  sellerId,
  buyerId,
  review,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [shouldShowReviewPrompt, setShouldShowReviewPrompt] = useState(
    product.status === 'SOLD_OUT' && review.length === 0
  );
  const channel = useRef<RealtimeChannel>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReviewSubmit = () => {
    setShouldShowReviewPrompt(false);
  };

  const handleStatusChange = (newStatus: keyof typeof ProductStatus) => {
    if (newStatus === 'SOLD_OUT') {
      setShouldShowReviewPrompt(true);
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: 'string',
          avatar: 'xxx',
        },
      },
    ]);
    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage('');
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current.on('broadcast', { event: 'message' }, (payload) => {
      console.log(payload);
      setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
    });
    channel.current
      .on('broadcast', { event: 'status_change' }, (payload) => {
        if (payload.payload.status === 'SOLD_OUT') {
          window.location.reload(); // 상태가 SOLD_OUT일 경우 새로고침
        }
      })

      .subscribe();
    return () => {
      channel.current?.unsubscribe();
      markMessagesAsRead(chatRoomId, userId);
    };
  }, [chatRoomId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessagesRead = () => {
    setNewMessageCount(0);
  };
  return (
    <div className="flex flex-col min-h-screen ">
      {/* 고정된 헤더 */}
      <div className=" fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="flex items-start justify-between border-b-2 border-neutral-700 bg-opacity-5">
          <BeforePage />
          <h1 className="flex-grow text-center text-2xl py-5">{buyer}</h1>
          <div className="w-7" />
        </div>
        <div className="flex p-3 gap-3 border-b-2 border-neutral-600">
          <div className="w-20 h-20 relative">
            <Image
              src={`${product.photo}/public`}
              alt={product.title}
              fill
              className="aspect-square object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              {userId === product.userId ? (
                <StatusSelector
                  productId={product.id}
                  initialStatus={product.status as keyof typeof ProductStatus}
                  onStatusChange={handleStatusChange} // 변경된 부분
                />
              ) : null}
              <h1 className="text-lg">{product.title}</h1>
            </div>
            <h1>{formatToWon(product.price)}원</h1>
          </div>
        </div>
      </div>

      <div className="p-5 pt-[150px] flex flex-col gap-5 min-h-screen justify-end">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${
              message.userId === userId ? 'justify-end' : ''
            }`}
          >
            {message.userId === userId ? null : (
              <Image
                src={`${message.user.avatar}/public`}
                alt={message.user.username}
                width={40}
                height={40}
                className="rounded-full aspect-square"
              />
            )}
            <div
              className={`flex flex-col gap-1 ${
                message.userId === userId ? 'items-end' : ''
              }`}
            >
              <span
                className={`${
                  message.userId === userId ? 'bg-neutral-500' : 'bg-red-500'
                } p-2.5 rounded-md`}
              >
                {message.payload}
              </span>
              <span className="text-xs">
                {message.created_at.toString() === new Date().toISOString()
                  ? formatToDayAndTime(message.created_at.toString())
                  : formatToTime(message.created_at.toString())}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />

      {shouldShowReviewPrompt ? (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <ReviewForm
            product={product}
            username={username}
            userId={userId}
            buyerId={buyerId}
            sellerId={sellerId}
            onReviewSubmit={handleReviewSubmit}
          />
        </div>
      ) : (
        <div ref={messagesEndRef} className="p-3">
          <form className="flex relative" onSubmit={onSubmit}>
            <input
              required
              onChange={onChange}
              value={message}
              className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
              type="text"
              name="message"
              placeholder="Write a message..."
            />
            <button className="absolute right-0" onClick={handleMessagesRead}>
              <ArrowUpCircleIcon className="size-10 text-red-500 transition-colors hover:text-orange-300" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
