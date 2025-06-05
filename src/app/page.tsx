"use client";

import type React from "react";

import { useState } from "react";
import {
  Upload,
  Search,
  List,
  Check,
  Info,
  ImageDown,
  Webcam,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { WebcamUpload } from "@/components/WebcamUpload";
import ImageUpload from "@/components/ImageUpload";

export default function FruitRecognitionSystem() {
  const [tab, setTab] = useState<"image" | "webcam">("image");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    vietnamese: string;
  } | null>(null);

  const translations: Record<string, string> = {
    apple: "Táo",
    banana: "Chuối",
    grape: "Nho",
    mango: "Xoài",
    strawberry: "Dâu tây",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text py-2 mb-4">
            🍎 Hệ thống phân loại trái cây
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Khám phá công nghệ AI phân loại trái cây chỉ với một bức ảnh. Tải
            lên hình ảnh và nhận kết quả ngay lập tức!
          </p>
        </motion.header>

        <div className="grid md:grid-cols-12 gap-8">
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-center gap-4">
              <Button
                onClick={() => setTab("image")}
                className={`w-full py-6 rounded-xl font-medium text-white transition-all duration-300 ${
                  tab !== "image"
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-purple-200"
                }`}
              >
                Ảnh <ImageDown />
              </Button>
              <Button
                onClick={() => setTab("webcam")}
                className={`w-full py-6 rounded-xl font-medium text-white transition-all duration-300 ${
                  tab !== "webcam"
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-purple-200"
                }`}
              >
                Webcam <Webcam />
              </Button>
            </div>
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              {tab === "webcam" ? (
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
                    <Upload className="h-5 w-5" /> Vui lòng đưa trái cây vào ảnh
                  </h2>
                  <WebcamUpload
                    setIsLoading={setIsLoading}
                    setPreview={setPreview}
                    setResult={setResult}
                    translations={translations}
                  />
                </CardContent>
              ) : (
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
                    <Upload className="h-5 w-5" /> Tải lên ảnh trái cây
                  </h2>
                  <ImageUpload
                    isLoading={isLoading}
                    preview={preview}
                    setIsLoading={setIsLoading}
                    setPreview={setPreview}
                    setResult={setResult}
                    translations={translations}
                  />
                </CardContent>
              )}
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-xl h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5" /> Kết quả phân loại
                </h2>

                <div className="flex-grow flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {!preview && !result ? (
                      <motion.div
                        key="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center p-8"
                      >
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Info className="h-10 w-10 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-purple-700 mb-2">
                          Chưa có ảnh nào được tải lên
                        </h3>
                        <p className="text-gray-500">
                          Tải lên hình ảnh trái cây để hệ thống AI phân loại và
                          phân tích
                        </p>
                      </motion.div>
                    ) : isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center p-8"
                      >
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-medium text-purple-700 mb-2">
                          Đang phân tích...
                        </h3>
                        <p className="text-gray-500">
                          Hệ thống AI đang xử lý hình ảnh của bạn
                        </p>
                      </motion.div>
                    ) : result ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                      >
                        <div className="relative w-full max-w-xs mx-auto h-48 mb-6">
                          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                              src={preview || "/placeholder.svg"}
                              alt="Ảnh trái cây"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
                          <div className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full p-2 mb-3">
                            <Check className="h-5 w-5" />
                          </div>
                          <h3 className="text-xl font-semibold text-purple-800 mb-1">
                            Kết quả phân loại
                          </h3>
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm mb-3">
                            <p className="text-gray-500 text-sm mb-1">
                              Tên tiếng Anh:
                            </p>
                            <p className="text-lg font-medium text-purple-700">
                              {result.prediction}
                            </p>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                            <p className="text-gray-500 text-sm mb-1">
                              Tên tiếng Việt:
                            </p>
                            <p className="text-lg font-medium text-purple-700">
                              {result.vietnamese}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview-only"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center p-8"
                      >
                        <div className="relative w-full max-w-xs mx-auto h-48 mb-4">
                          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                              src={preview || "/placeholder.svg"}
                              alt="Ảnh xem trước"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium text-purple-700 mb-2">
                          Ảnh đã sẵn sàng
                        </h3>
                        <p className="text-gray-500">
                          Nhấn nút &quot;Phân loại trái cây&quot; để bắt đầu
                          phân tích
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <List className="h-4 w-4 mr-2" />
                        Danh sách trái cây được hỗ trợ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/90 backdrop-blur-md">
                      <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                          📋 Danh sách trái cây được hỗ trợ
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
                        {Object.entries(translations).map(([eng, vn]) => (
                          <motion.div
                            key={eng}
                            className="p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-purple-100"
                            whileHover={{ y: -2 }}
                          >
                            <p className="font-medium text-purple-700">{vn}</p>
                            <p className="text-sm text-gray-500">({eng})</p>
                          </motion.div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
