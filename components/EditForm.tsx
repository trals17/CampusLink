"use client";

import Image from "next/image";
import { useState } from "react";
import { useFormState } from "react-dom";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getUploadUrl } from "@/app/products/add/actions";
import EditAction from "@/app/products/[id]/edit/actions";
import Input from "./input";
import Button from "./button";

interface EditFormProps {
  product: {
    id: number;
    photo: string;
    title: string;
    price: number;
    description: string;
  };
}

export default function EditForm({ product }: EditFormProps) {
  // 기존 photo URL을 초기 preview로 설정
  const [preview, setPreview] = useState<string>(product.photo);
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [hasNewFile, setHasNewFile] = useState(false);

  // 파일 선택 시 실행
  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      return alert("이미지 파일만 업로드 가능합니다.");
    }
    if (file.size / 1024 / 1024 > 2) {
      return alert("2MB를 초과하는 이미지는 업로드 할 수 없습니다.");
    }
    // 로컬 미리보기
    setPreview(URL.createObjectURL(file));
    setHasNewFile(true);
    // Cloudflare 업로드 URL 요청
    const { result, success } = await getUploadUrl();
    if (success) {
      setUploadUrl(result.uploadURL);
      setPhotoId(result.id);
    }
  };

  // 폼 제출 인터셉트
  const interceptAction = async (prevState: any, formData: FormData) => {
    if (hasNewFile) {
      const file = formData.get("photo");
      if (file instanceof File) {
        const cfForm = new FormData();
        cfForm.append("file", file);
        const resp = await fetch(uploadUrl, { method: "POST", body: cfForm });
        if (!resp.ok) return;
        const data = await resp.json();
        const imageId = data.result?.id ?? photoId;
        const publicUrl =
          data.result?.variants?.[0] ||
          `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
        formData.set("photo", publicUrl);
      }
    } else {
      // 새 파일 없으면 기존 URL 사용
      formData.set("photo", product.photo);
    }
    return EditAction(prevState, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <form
      action={action}
      method="post"
      encType="multipart/form-data"
      className="flex flex-col gap-4"
    >
      {/* 상품 ID 숨김 필드 */}
      <input type="hidden" name="id" value={product.id} />

      {/* 사진 미리보기 및 파일 입력 */}
      <label
        htmlFor="photo"
        className="w-32 h-32 rounded-full bg-gray-200 bg-center bg-cover"
        style={{ backgroundImage: `url(${preview})` }}
      >
        {!preview && <PhotoIcon className="w-16 h-16 text-gray-400" />}
      </label>
      <input
        id="photo"
        name="photo"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
      />

      {/* 기타 입력 필드 */}
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
