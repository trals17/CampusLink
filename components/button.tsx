"use client";

import Loading from "@/app/products/add/loading";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
  /** 버튼 동작 유형: 기본은 'button', 폼 제출용은 'submit' */
  type?: "button" | "submit" | "reset";
}

export default function Button({ text, type = "button" }: ButtonProps) {
  const { pending } = useFormStatus();

  // pending 상태일 때 Loading 컴포넌트만 보여줌
  if (pending) {
    return <Loading />;
  }

  return (
    <button
      type={type}
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {text}
    </button>
  );
}
