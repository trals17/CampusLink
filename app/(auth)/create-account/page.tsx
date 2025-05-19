'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import SocialLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { createAccountAction } from './action';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';
import { getUploadUrl } from '@/app/products/add/actions';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function CreateAccount() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [photoId, setPhotoId] = useState('');
  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) {
      return;
    }
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      return {
        error: '이미지 파일만 업로드 가능합니다. ',
      };
    }

    const fileSizeInMd = file.size / (1024 * 1024);

    if (fileSizeInMd > 2) {
      return {
        error:
          '이미지의 크기가 2MD를 초과하는 이미지는 업로드 할 수 없습니다. ',
      };
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { result, success } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    }
    console.log(result);
  };

  const interceptAction = async (prevState: any, formData: FormData) => {
    const file = formData.get('avatar');
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudflareForm,
    });
    console.log(await response.text());
    if (response.status !== 200) {
      return;
    }
    const photoUrl = `https://imagedelivery.net/2YRH3jpkhrWOOYZOL3zGhA/2df9c2a9-e527-4e70-f9f1-2a3d5fca9b00`;
    formData.set('avatar', photoUrl);
    return createAccountAction(prevState, formData);
  };
  const [state, dispatch] = useFormState(interceptAction, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          <strong className="text-lg font-bold text-yellow-600">
            운동감자
          </strong>
          가 될 준비가 되셨나요 ?
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3 ">
        <label
          htmlFor="avatar"
          className="border-2 aspect-square items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover size-40 text-center hidden"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview ? null : (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.avatar}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          className="hidden"
        />
        <Input
          type="text"
          required
          name="username"
          placeholder="운동감자의 이름은"
          errors={state?.fieldErrors.username}
        />
        <Input
          name="email"
          type="email"
          required
          placeholder="운동감자의 이메일은"
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          required
          placeholder="운동감자의 비밀스런 비밀번호는?"
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          name="comfirmPassword"
          type="password"
          required
          placeholder="운동감자의 비밀스런 비밀번호를 다시.."
          errors={state?.fieldErrors.comfirmPassword}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
