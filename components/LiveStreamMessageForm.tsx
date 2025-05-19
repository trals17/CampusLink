'use client';

import {
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from './chat-message';
import { InitialChatMessages } from './LiveStreamChat';
import { saveLiveChatMessage } from '@/app/streams/[id]/action';
import Image from 'next/image';

interface LiveChatMessageListProps {
  initialMessages: InitialChatMessages;
  id: number;
  userId: number;
  username: string;
  avatar: string;
}

export default function LiveStreamMessageForm({
  id,
  userId,
  initialMessages,
  username,
  avatar,
}: LiveChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const [showAllMessages, setShowAllMessages] = useState(false);
  const channel = useRef<RealtimeChannel>();

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

    channel.current = client.channel(`room -${id}`);
    channel.current
      .on('broadcast', { event: 'message' }, (payload) => {
        console.log(payload);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [id]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMessage(value);
  };

  // 메시지 제출 처리
  const onsubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMsg = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      user: {
        username,
        avatar,
      },
    };

    setMessages((prevMessages) => [...prevMessages, newMsg]);
    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: newMsg,
    });
    await saveLiveChatMessage(message, id);
    setMessage(''); // 메시지 전송 후 입력 필드 초기화
  };

  const displayedMessages = showAllMessages ? messages : messages.slice(-7);

  return (
    <>
      <div className="flex flex-col gap-3 mb-10">
        {messages.length > 8 && !showAllMessages && (
          <button
            onClick={() => setShowAllMessages(true)}
            className="text-orange-600 flex items-center justify-center text-center"
          >
            <EllipsisHorizontalIcon className="size-8" />
          </button>
        )}
        {displayedMessages.map((msg) => (
          <div key={msg.created_at.toString()} className="flex flex-row gap-2">
            <Image
              src={`${msg.user.avatar}/public`} // 기본 이미지 설정
              alt={msg.user.username}
              width={100}
              height={100}
              className="size-5 rounded-full"
            />
            <h3 className="text-neutral-500">{msg.user.username}</h3>
            {userId === msg.userId ? (
              <p className="text-orange-500 font-semibold">{msg.payload}</p>
            ) : (
              <p className="font-semibold">{msg.payload}</p>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 p-3 z-10">
        <form className="flex flex-row w-full gap-3" onSubmit={onsubmit}>
          <input
            name="liveStreamMessage"
            required
            value={message}
            onChange={onChange}
            type="text"
            placeholder="소통해볼까요?"
            className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          />
          <button type="submit">
            <ChatBubbleOvalLeftEllipsisIcon className="size-8" />
          </button>
        </form>
      </div>
    </>
  );
}
