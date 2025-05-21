"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import BeforePage from "@/components/BeforePage";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      return alert("이미지 파일만 업로드 가능합니다.");
    }
    if (file.size / (1024 * 1024) > 2) {
      return alert("크기가 2MB를 초과하는 이미지는 업로드 할 수 없습니다.");
    }
    setPreview(URL.createObjectURL(file));
    const { result, success } = await getUploadUrl();
    if (success) {
      setUploadUrl(result.uploadURL);
      setPhotoId(result.id);
    }
  };

  const interceptAction = async (prevState: any, formData: FormData) => {
    const file = formData.get("photo");
    if (file instanceof File) {
      // 1) Cloudflare에 파일 POST
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });
      if (!response.ok) return;

      // 2) JSON 한 번만 파싱
      const data = await response.json();

      // 3) 이미지 URL 조합
      const imageId = data.result?.id ?? photoId;
      const publicUrl =
        data.result?.variants?.[0] ||
        `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;

      formData.set("photo", publicUrl);
    }

    return uploadProduct(prevState, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div>
      <form
        action={action}
        method="post"
        encType="multipart/form-data"
        className="p-5 flex flex-col gap-5"
      >
        <div className="flex flex-row justify-center items-center">
          <BeforePage />
          <h1 className="text-center text-2xl">물품을 판매해주세요.</h1>
        </div>

        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview ? null : (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />

        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />

        <Button type="submit" text="작성 완료" />
      </form>
    </div>
  );
}
