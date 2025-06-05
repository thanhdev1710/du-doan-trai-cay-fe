import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";

export const WebcamUpload = ({
  setPreview,
  setIsLoading,
  setResult,
  translations,
}: {
  translations: Record<string, string>;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<
    React.SetStateAction<{
      prediction: string;
      vietnamese: string;
    } | null>
  >;
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const isPredictingRef = useRef<boolean>(false);

  const videoConstraints = {
    facingMode: facingMode === "user" ? "user" : { exact: "environment" },
  };

  const getBaseLabel = (label: string) => label.replace(/\s\d+$/, "").trim();

  const captureAndPredict = useCallback(async () => {
    if (!webcamRef.current || isPredictingRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    setPreview(screenshot);
    isPredictingRef.current = true;
    setIsLoading(true);
    setResult(null);

    try {
      const blob = await fetch(screenshot).then((res) => res.blob());
      const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });

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
      if (!response.ok) throw new Error(data.error || "Unknown error");

      const top1 = Object.entries(data.prediction)
        .map(([label, percent]) => [label, parseFloat(percent as string)])
        .sort((a, b) => Number(b[1]) - Number(a[1]))[0];

      const prediction = getBaseLabel(top1[0] as string);

      setResult({
        prediction: `${prediction}: ${top1[1]}%`,
        vietnamese: `${translations[prediction]}: ${top1[1]}%` || "Không rõ",
      });
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
      isPredictingRef.current = false;
    }
  }, [setIsLoading, setResult, setPreview, translations]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isCameraOn) {
      interval = setInterval(() => {
        captureAndPredict();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraOn, captureAndPredict]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      if (prev) setPreview(null);
      return !prev;
    });
  };

  const switchFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={toggleCamera}
          className="bg-blue-600 text-white"
        >
          {isCameraOn ? "Tắt camera" : "Bật camera"}
        </Button>

        <Button
          type="button"
          onClick={switchFacingMode}
          className="bg-gray-600 text-white"
          disabled={!isCameraOn}
        >
          Chuyển camera {facingMode === "user" ? "sau" : "trước"}
        </Button>
      </div>

      {isCameraOn && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full max-w-sm rounded-lg shadow"
        />
      )}
    </div>
  );
};
