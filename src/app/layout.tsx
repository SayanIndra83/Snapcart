import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast"
import AuthProvider from "@/context/AuthProvider";

export const metadata: Metadata = {
  title: "Snapcart | 10 minutes grocery Delivery App",
  description: "10 minutes grocery Delivery App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="bg-linear-to-b from-green-200 to-white w-full">
        <Toaster position="top-right"/>
        <AuthProvider>
          {children}
        </AuthProvider>
        </body>
    </html>
  );
}
