"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccountAction } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { getUploadUrl } from "@/app/products/add/actions";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function CreateAccount() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      return { error: "이미지 파일만 업로드 가능합니다." };
    }
    if (file.size / (1024 * 1024) > 2) {
      return { error: "2MB를 초과하는 이미지는 업로드 할 수 없습니다." };
    }
    setPreview(URL.createObjectURL(file));
    const { result, success } = await getUploadUrl();
    if (success) {
      setUploadUrl(result.uploadURL);
      setPhotoId(result.id);
    }
    console.log(result);
  };

  const interceptAction = async (prevState: any, formData: FormData) => {
    const file = formData.get("avatar");
    if (!file || !(file instanceof File)) return;

    // 1) Cloudflare에 파일 POST
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });
    if (!response.ok) {
      console.error("Cloudflare 업로드 실패:", response.status);
      return;
    }

    // 2) JSON 한 번만 파싱
    const data = await response.json();
    console.log("Cloudflare 업로드 결과:", data);

    // 3) 실제 이미지 ID와 URL 추출
    const imageId = data.result?.id;
    const publicUrl =
      data.result?.variants?.[0] ??
      `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;

    if (!imageId) {
      console.error("Cloudflare에서 이미지 ID를 반환하지 않음");
      return;
    }
    formData.set("avatar", publicUrl);

    // 4) 서버 액션 호출
    return createAccountAction(prevState, formData);
  };

  const [state, dispatch] = useFormState(interceptAction, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요 !</h1>
        <h2 className="text-xl">
          <strong className="text-lg font-bold text-yellow-600"></strong>
          캠퍼스 커뮤니티에 오신 것을 환영합니다 !
        </h2>
      </div>
      {/* 파일 전송을 위해 method와 encType 명시 */}
      <form
        action={dispatch}
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-3"
      >
        <label
          htmlFor="avatar"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover size-40 text-center"
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
          placeholder="이름은?"
          errors={state?.fieldErrors.username}
        />
        <Input
          name="email"
          type="email"
          required
          placeholder="이메일은?"
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          required
          placeholder="비밀번호는?"
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          name="comfirmPassword"
          type="password"
          required
          placeholder="비밀번호를 다시.."
          errors={state?.fieldErrors.comfirmPassword}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button type="submit" text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
