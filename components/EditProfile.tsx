"use client";

import EditProfileAction from "@/app/(tabs)/profile/edit/[id]/actions";
import { getUploadUrl } from "@/app/products/add/actions";
import Image from "next/image";
import { useState } from "react";
import { useFormState } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Input from "./input";
import Link from "next/link";
import BeforePage from "./BeforePage";

interface EditProfileProps {
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
}

export default function EditProfile({ user }: EditProfileProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return alert("이미지 파일만 업로드가 가능합니다");
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert("2MB를 초과하는 이미지는 업로드 할 수 없습니다.");
    }
    // 미리보기
    const url = URL.createObjectURL(file);
    setPreview(url);
    // 업로드 URL 받아오기
    const { result, success } = await getUploadUrl();
    if (success) {
      setUploadUrl(result.uploadURL);
    }
  };

  const interceptAction = async (_prevState: any, formData: FormData) => {
    const file = formData.get("avatar");
    if (file instanceof File) {
      // 1) Cloudflare에 파일 POST
      const cfForm = new FormData();
      cfForm.append("file", file);
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: cfForm,
      });
      if (!res.ok) throw new Error("이미지 업로드 실패");
      const data = await res.json();
      const imageId = data.result?.id;
      const publicUrl =
        data.result?.variants?.[0] ||
        `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
      // formData 갱신
      formData.set("avatar", publicUrl);
      setPreview(publicUrl);
    } else {
      // 변경된 이미지 없으면 기존 URL 그대로
      formData.set("avatar", user.avatar || "");
    }

    // 서버 액션 호출 (FormData만 넘깁니다)
    return EditProfileAction(formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div className="p-5 flex flex-col gap-5">
      <form action={action} method="post" encType="multipart/form-data">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <BeforePage />
          <h3 className="text-2xl font-semibold">프로필 수정</h3>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            완료
          </button>
        </div>

        {/* 아바타 업로드 & 미리보기 */}
        <div className="flex justify-center items-center mt-10">
          <label className="cursor-pointer" htmlFor="avatar-input">
            {preview ? (
              <div
                className="rounded-full"
                style={{
                  backgroundImage: `url(${preview})`,
                  backgroundSize: "cover",
                  width: "80px",
                  height: "80px",
                }}
              />
            ) : (
              <Image
                src={user.avatar!}
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

        {/* 숨겨진 ID 필드 */}
        <input type="hidden" name="id" value={user.id} />

        {/* 닉네임 입력 */}
        <div className="flex flex-col gap-3 mt-6">
          <label htmlFor="username" className="font-medium">
            닉네임
          </label>
          <Input
            id="username"
            name="username"
            required
            placeholder="username"
            type="text"
            defaultValue={user.username}
            errors={state?.fieldErrors?.username}
          />
        </div>
      </form>
    </div>
  );
}
