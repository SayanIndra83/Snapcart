import type { Metadata } from "next";
import "./globals.css";
import {Toaster} from "react-hot-toast"
import AuthProvider from "@/context/AuthProvider";
import StoreProvider from "@/context/StoreProvider";
import InitUser from "@/InitUser";

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
      <body className="bg-linear-to-b min-h-screen from-green-200 to-white w-full">
        <Toaster position="top-right"/>
        <AuthProvider>
          <StoreProvider>
            <InitUser/>
            {children}
          </StoreProvider>
        </AuthProvider>
        </body>
    </html>
  );
}
