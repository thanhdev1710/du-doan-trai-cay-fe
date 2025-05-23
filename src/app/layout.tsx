import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <title>Hệ thống nhận diện trái cây</title>
        <meta
          name="description"
          content="Hệ thống nhận diện trái cây sử dụng trí tuệ nhân tạo"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
