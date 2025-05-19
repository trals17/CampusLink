'use client';

import Image from 'next/image';
import BeforePage from './BeforePage';
import DeleteButton from './DeleteUserBtn';

interface ILeaveFormProps {
  user: {
    username: string;
  };
  id: number;
}

export default function LeaveForm({ user, id }: ILeaveFormProps) {
  return (
    <>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-row justify-center border-b-2 border-neutral-600">
          <BeforePage />
          <h1 className="text-center pb-3">탈퇴하기</h1>
        </div>
        <div className="text-3xl py-5 text-center">
          <span className="text-orange-600"> {user?.username}</span>
          <span>님, 잠깐만요! </span>
          <div className="text-2xl"> 계정을 삭제하기 전에 꼭 읽어주세요.</div>
        </div>
        <div className="p-4 bg-neutral-800 rounded-md">
          <ul className="list-disc pl-5 space-y-2">
            <li>모든 게시물 및 채팅방이 삭제됩니다.</li>
            <li>
              계정을 삭제한 후에는 계정을 살리거나, 게시글, 채팅 등의 데이터를
              복구할 수 없습니다.
            </li>
            <li>현재 계정으로 다시 로그인할 수 없습니다.</li>
            <li>무엇보다 운동감자를 만날 수 없습니다.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 pt-8">
          <div className="flex flex-row justify-center items-center">
            <Image
              src={'/속상한감자.png'}
              alt="운동감자"
              width={100}
              height={100}
            />
            <div className="flex flex-col">
              <h1 className="text-center text-lg">
                운동감자를 그만 두실 건가요?
              </h1>
              <p className="text-sm">우리 같이 감자해요..</p>
            </div>
          </div>
          <DeleteButton userId={id} />
        </div>
      </div>
    </>
  );
}
