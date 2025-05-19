'use client';

import { useFormState } from 'react-dom';
import Input from './input';
import ListComment from './Listcomment';
import CommentAction from '@/app/posts/[id]/actions';
import { useState } from 'react';

interface ICommentFormProps {
  postId: number;
  userId: number;
  comments: Array<{
    id: number;
    payload: string;
    created_at: Date;
    user: {
      username: string;
      avatar: string | null;
    };
  }>;
}

export default function CommentForm({
  postId,
  userId,
  comments,
}: ICommentFormProps) {
  const [comment, setComment] = useState('');
  const [state] = useFormState(CommentAction, null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 방지

    if (comment) {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('payload', comment);
      formData.append('postId', postId.toString());
      formData.append('userId', userId.toString());

      try {
        await CommentAction(null, formData); // 댓글 서버에 추가
        setComment(''); // 입력 필드 비우기
      } catch (error) {
        console.error('댓글 추가 중 오류 발생:', error);
        // 오류 처리 로직 추가 가능
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          name="payload"
          type="text"
          required
          placeholder="댓글을 입력해주세요."
          errors={state?.errors?.fieldErrors?.payload}
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setComment(e.target.value)
          }
        />
        <input name="postId" value={postId} type="hidden" readOnly />
        <input name="userId" value={userId} type="hidden" readOnly />
        <div className="self-end">
          <button type="submit" className="bg-red-500 p-2 px-4 rounded-lg">
            작성하기
          </button>
        </div>
      </form>

      <ListComment comments={comments} />
    </div>
  );
}
