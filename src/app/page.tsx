"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Upload,
  Search,
  BananaIcon as Fruit,
  List,
  ArrowUpCircle,
  X,
  Check,
  Info,
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

export default function FruitRecognitionSystem() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    vietnamese: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations: Record<string, string> = {
    Apple: "Táo",
    "Apple Braeburn": "Táo Braeburn",
    "Apple Core": "Lõi táo",
    "Apple Crimson Snow": "Táo Crimson Snow",
    "Apple Golden": "Táo vàng",
    "Apple Granny Smith": "Táo Granny Smith",
    "Apple Pink Lady": "Táo Pink Lady",
    "Apple Red": "Táo đỏ",
    "Apple Red Delicious": "Táo Red Delicious",
    "Apple Red Yellow": "Táo đỏ vàng",
    "Apple Rotten": "Táo thối",
    "Apple hit": "Táo bị dập",
    "Apple worm": "Táo có sâu",
    Apricot: "Mơ",
    Avocado: "Bơ",
    "Avocado Black": "Bơ đen",
    "Avocado Green": "Bơ xanh",
    "Avocado ripe": "Bơ chín",
    Banana: "Chuối",
    "Banana Lady Finger": "Chuối sứ",
    "Banana Red": "Chuối đỏ",
    Beans: "Đậu",
    Beetroot: "Củ dền",
    Blackberry: "Mâm xôi đen",
    "Blackberry half ripen": "Mâm xôi chưa chín hoàn toàn",
    "Blackberry not ripen": "Mâm xôi xanh",
    Blueberry: "Việt quất",
    "Cabbage red": "Bắp cải tím",
    "Cabbage white": "Bắp cải trắng",
    "Cactus fruit": "Thanh long",
    "Cactus fruit green": "Thanh long xanh",
    "Cactus fruit red": "Thanh long đỏ",
    "Caju seed": "Hạt điều",
    Cantaloupe: "Dưa vàng",
    Carambula: "Carambula",
    Carrot: "Cà rốt",
    Cauliflower: "Súp lơ",
    Cherimoya: "Na",
    Cherry: "Anh đào",
    "Cherry Rainier": "Anh đào Rainier",
    "Cherry Sour": "Anh đào chua",
    "Cherry Wax Black": "Anh đào đen",
    "Cherry Wax Red": "Anh đào đỏ",
    "Cherry Wax Yellow": "Anh đào vàng",
    "Cherry Wax not ripen": "Anh đào chưa chín",
    Chestnut: "Hạt dẻ",
    Clementine: "Quýt",
    Cocos: "Dừa",
    Corn: "Bắp",
    "Corn Husk": "Vỏ bắp",
    Cucumber: "Dưa chuột",
    "Cucumber Ripe": "Dưa chuột chín",
    Dates: "Chà là",
    Eggplant: "Cà tím",
    "Eggplant long": "Cà tím dài",
    Fig: "Sung",
    "Ginger Root": "Gừng",
    Gooseberry: "Phúc bồn tử xanh",
    Granadilla: "Chanh dây vàng",
    "Grape Blue": "Nho xanh đậm",
    "Grape Pink": "Nho hồng",
    "Grape White": "Nho trắng",
    "Grapefruit Pink": "Bưởi hồng",
    "Grapefruit White": "Bưởi trắng",
    Guava: "Ổi",
    Hazelnut: "Hạt phỉ",
    Huckleberry: "Việt quất rừng",
    Kaki: "Hồng",
    Kiwi: "Kiwi",
    Kohlrabi: "Su hào",
    Kumquats: "Tắc",
    Lemon: "Chanh",
    "Lemon Meyer": "Chanh Meyer",
    Limes: "Chanh xanh",
    Lychee: "Vải",
    Mandarine: "Quýt",
    Mango: "Xoài",
    "Mango Red": "Xoài đỏ",
    Mangostan: "Măng cụt",
    Maracuja: "Chanh leo",
    "Melon Piel de Sapo": "Dưa Tây Ban Nha",
    Mulberry: "Dâu tằm",
    Nectarine: "Đào trơn",
    "Nectarine Flat": "Đào dẹt",
    "Nut Forest": "Hạt rừng",
    "Nut Pecan": "Hạt hồ đào",
    "Onion Red": "Hành đỏ",
    "Onion Red Peeled": "Hành đỏ bóc vỏ",
    "Onion White": "Hành trắng",
    Orange: "Cam",
    Papaya: "Đu đủ",
    "Passion Fruit": "Chanh dây",
    Peach: "Đào",
    "Peach Flat": "Đào dẹt",
    Pear: "Lê",
    "Pear Abate": "Lê Abate",
    "Pear Forelle": "Lê Forelle",
    "Pear Kaiser": "Lê Kaiser",
    "Pear Monster": "Lê khổng lồ",
    "Pear Red": "Lê đỏ",
    "Pear Stone": "Lê hột cứng",
    "Pear Williams": "Lê Williams",
    Pepino: "Dưa Pepino",
    "Pepper Green": "Ớt xanh",
    "Pepper Orange": "Ớt cam",
    "Pepper Red": "Ớt đỏ",
    "Pepper Yellow": "Ớt vàng",
    Physalis: "Tầm bóp",
    "Physalis with Husk": "Tầm bóp có vỏ",
    Pineapple: "Dứa",
    "Pineapple Mini": "Dứa mini",
    Pistachio: "Hạt dẻ cười",
    "Pitahaya Red": "Thanh long đỏ",
    Plum: "Mận",
    Pomegranate: "Lựu",
    "Pomelo Sweetie": "Bưởi ngọt",
    "Potato Red": "Khoai tây đỏ",
    "Potato Red Washed": "Khoai đỏ rửa sạch",
    "Potato Sweet": "Khoai lang",
    "Potato White": "Khoai tây trắng",
    Quince: "Mộc qua",
    Rambutan: "Chôm chôm",
    Raspberry: "Mâm xôi đỏ",
    Redcurrant: "Lý chua đỏ",
    Salak: "Salak",
    Strawberry: "Dâu tây",
    "Strawberry Wedge": "Dâu cắt lát",
    Tamarillo: "Cà chua thân gỗ",
    Tangelo: "Cam lai",
    Tomato: "Cà chua",
    "Tomato Cherry Maroon": "Cà chua bi đỏ sẫm",
    "Tomato Cherry Orange": "Cà chua bi cam",
    "Tomato Cherry Red": "Cà chua bi đỏ",
    "Tomato Cherry Yellow": "Cà chua bi vàng",
    "Tomato Heart": "Cà chua hình tim",
    "Tomato Maroon": "Cà chua đỏ sẫm",
    "Tomato Yellow": "Cà chua vàng",
    "Tomato not Ripen": "Cà chua xanh",
    Walnut: "Óc chó",
    Watermelon: "Dưa hấu",
    Zucchini: "Bí ngòi",
    "Zucchini dark": "Bí ngòi đậm màu",
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

      // Reset results when new file is selected
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

      // Reset results when new file is dropped
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

      const response = await fetch(
        "https://du-doan-trai-cay.onrender.com/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        const prediction = getBaseLabel(data.prediction);
        setResult({
          prediction,
          vietnamese: translations[prediction] || "Không rõ",
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

  const getBaseLabel = (label: string) => {
    return label.replace(/\s\d+$/, "").trim();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text py-2 mb-4">
            🍎 Hệ thống nhận diện trái cây
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Khám phá công nghệ AI nhận diện trái cây chỉ với một bức ảnh. Tải
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
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5" /> Tải lên ảnh trái cây
                </h2>

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
                          <Fruit className="h-12 w-12 text-purple-400 mx-auto mb-3" />
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
                        Nhận diện trái cây
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
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
                  <Search className="h-5 w-5" /> Kết quả nhận diện
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
                          Tải lên hình ảnh trái cây để hệ thống AI nhận diện và
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
                            Kết quả nhận diện
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
                          Nhấn nút &quot;Nhận diện trái cây&quot; để bắt đầu
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
