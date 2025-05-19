'use client';

import EditProfileAction from '@/app/(tabs)/profile/edit/[id]/actions';
import { getUploadUrl } from '@/app/products/add/actions';
import Image from 'next/image';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Input from './input';
import Link from 'next/link';
import BeforePage from './BeforePage';

interface User {
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
}

export default function EditProfile({ user }: User) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [profilePhotoId, setProfilePhotoId] = useState('');

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) {
      return;
    }

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      return alert('이미지 파일만 업로드가 가능합니다');
    }

    const fileSizeInMb = file.size / (1024 * 1024);

    if (fileSizeInMb > 2) {
      return alert(
        '이미지의 크기가 2MB를 초과하는 이미지는 업로드 할 수 없습니다.'
      );
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    const { result, success } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setProfilePhotoId(id);
    }
  };

  const interceptAction = async (prevState: any, formData: FormData) => {
    const file = formData.get('avatar');
    if (file instanceof File) {
      const cloudflareForm = new FormData();
      cloudflareForm.append('file', file);
      const response = await fetch(uploadUrl, {
        method: 'post',
        body: cloudflareForm,
      });
      if (response.status !== 200) {
        return;
      }

      const photoUrl = `https://imagedelivery.net/2YRH3jpkhrWOOYZOL3zGhA/${profilePhotoId}`;
      formData.set('avatar', photoUrl);
    }

    return EditProfileAction(prevState, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div className="p-5 flex flex-col gap-5">
      <form action={action}>
        <div className="flex justify-between items-center">
          <BeforePage />
          <h3 className="text-2xl font-semibold">프로필 수정</h3>
          <button>완료</button>
        </div>

        <div className="flex justify-center items-center mt-10">
          <label className="cursor-pointer" htmlFor="avatar-input">
            {preview ? (
              <div
                className="rounded-full"
                style={{
                  backgroundImage: `url(${preview})`,
                  backgroundSize: 'cover',
                  width: '80px',
                  height: '80px',
                }}
              />
            ) : (
              <Image
                src={`${user.avatar}/public`}
                alt={user.username}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
          </label>

          <input
            onChange={onImageChange}
            type="file"
            id="avatar-input"
            name="avatar"
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-3">
          <input type="hidden" name="id" value={user.id} />
          <h3 className="mt-4">닉네임</h3>
          <Input
            name="username"
            required
            placeholder="username"
            type="text"
            errors={state?.fieldErrors?.username}
            defaultValue={user.username}
          />
        </div>
      </form>
    </div>
  );
}
