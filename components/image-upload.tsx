"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  value: string | null;
  onChange: (base64: string | null) => void;
  onError?: (message: string) => void;
  maxSizeMB?: number;
  className?: string;
};

export function ImageUpload({
  value,
  onChange,
  onError,
  maxSizeMB = 4,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!file.type.startsWith("image/")) {
      onError?.("Please upload an image file.");
      return;
    }

    if (file.size > maxSize) {
      onError?.(`Image size must be less than ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
      console.log("image updated");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
          isDragging
            ? "border-amber-500 bg-amber-50"
            : "border-zinc-300 bg-zinc-50 hover:border-amber-400 hover:bg-amber-50/50"
        )}
      >
        <Upload className="mb-3 h-10 w-10 text-zinc-400" />
        <p className="mb-1 text-sm font-medium text-zinc-700">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-zinc-500">PNG, JPG, GIF up to {maxSizeMB}MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {value && (
        <div className="relative mt-4 rounded-lg border border-zinc-200 p-2">
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -right-2 -top-2 rounded-full z-10 bg-rose-500 p-1 text-white shadow-md transition hover:bg-rose-600"
          >
            <X className="size-4" />
          </button>
          <div className="relative h-48 w-full overflow-hidden rounded">
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
