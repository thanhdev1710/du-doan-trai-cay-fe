import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpCircle, BananaIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function ImageUpload({
  translations,
  preview,
  setPreview,
  isLoading,
  setIsLoading,
  setResult,
}: {
  translations: Record<string, string>;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<
    React.SetStateAction<{
      prediction: string;
      vietnamese: string;
    } | null>
  >;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getBaseLabel = (label: string) => {
    return label.replace(/\s\d+$/, "").trim();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);

      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);

      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:10000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const top1 = Object.entries(data.prediction)
          .map(([label, percent]) => [label, parseFloat(percent as string)]) // convert "14.6%" → 14.6
          .sort((a, b) => Number(b[1]) - Number(a[1]))[0];

        const textResult = top1[0] as string;

        const prediction = getBaseLabel(textResult);
        setResult({
          prediction: `${prediction}: ${top1[1]}%`,
          vietnamese: `${translations[prediction]}: ${top1[1]}%` || "Không rõ",
        });
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 mb-6 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-purple-500 bg-purple-50"
            : "border-purple-200 hover:border-purple-300 hover:bg-purple-50/50"
        }`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BananaIcon className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <p className="text-purple-700 font-medium">
                Kéo thả ảnh trái cây vào đây
              </p>
              <p className="text-sm text-gray-500 mt-1">
                hoặc nhấp để chọn từ thiết bị của bạn
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt="Ảnh xem trước"
                  fill
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        type="submit"
        className={`w-full py-6 rounded-xl font-medium text-white transition-all duration-300 ${
          !file
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-purple-200"
        }`}
        disabled={!file || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang phân tích...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5" />
            Phân loại trái cây
          </span>
        )}
      </Button>
    </form>
  );
}
