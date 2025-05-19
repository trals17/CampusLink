import DeleteUser from '@/app/(tabs)/profile/leave/actions';

export default function DeleteButton({ userId }: { userId: number }) {
  const onClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 기본 폼 제출 방지
    await DeleteUser(userId); // 서버 액션 호출
  };

  return (
    <form onSubmit={onClick}>
      <button type="submit" className="w-full h-10 bg-orange-600 rounded-lg">
        계정 삭제
      </button>
    </form>
  );
}
