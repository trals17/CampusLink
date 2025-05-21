"use client";

import Image from "next/image";
import { useState } from "react";
import { useFormState } from "react-dom";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getUploadUrl } from "@/app/products/add/actions";
import EditAction from "@/app/products/[id]/edit/actions";
import Input from "./input";
import Button from "./button";

interface IEditProps {
  product: {
    id: number;
    title: string;
    photo: string;
    description: string;
    price: number;
  };
}

export default function EditForm({ product }: IEditProps) {
  // 기존 photo URL을 초기 preview로 설정
  const [preview, setPreview] = useState<string>(product.photo);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [photoId, setPhotoId] = useState<string>("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size / (1024 * 1024) > 2) {
      alert("2MB를 초과하는 이미지는 업로드할 수 없습니다.");
      return;
    }

    // 로컬 미리보기 URL 설정
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Cloudflare 업로드 URL 요청
    const { result, success } = await getUploadUrl();
    if (success) {
      setUploadUrl(result.uploadURL);
      setPhotoId(result.id);
    }
  };

  const interceptAction = async (prevState: any, formData: FormData) => {
    const file = formData.get("photo");
    if (file instanceof File) {
      // Cloudflare 업로드
      const cf = new FormData();
      cf.append("file", file);
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: cf,
      });
      if (!res.ok) return;
      const data = await res.json();
      // 업로드된 imageId(또는 기존 photoId)로 public URL 생성
      const imageId = data.result?.id ?? photoId;
      const publicUrl =
        data.result?.variants?.[0] ||
        `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
      // 폼 데이터에 실제 URL로 설정
      formData.set("photo", publicUrl);
    }
    // 서버 액션 호출
    return EditAction(prevState, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <form
      action={action}
      method="post"
      encType="multipart/form-data"
      className="p-5 flex flex-col gap-5"
    >
      {/* 상품 ID */}
      <input type="hidden" name="id" value={product.id} />

      {/* 이미지 미리보기 */}
      <label
        htmlFor="photo"
        className="relative w-32 h-32 rounded-md overflow-hidden bg-gray-100 cursor-pointer"
      >
        {preview ? (
          <Image
            src={preview}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <PhotoIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </label>
      <input
        id="photo"
        name="photo"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
      />

      {/* 텍스트 필드 */}
      <Input
        name="title"
        type="text"
        placeholder="제목"
        required
        defaultValue={product.title}
        errors={state?.fieldErrors?.title}
      />
      <Input
        name="price"
        type="number"
        placeholder="가격"
        required
        defaultValue={product.price.toString()}
        errors={state?.fieldErrors?.price}
      />
      <Input
        name="description"
        type="text"
        placeholder="설명"
        required
        defaultValue={product.description}
        errors={state?.fieldErrors?.description}
      />

      <Button type="submit" text="수정 완료" />
    </form>
  );
}
