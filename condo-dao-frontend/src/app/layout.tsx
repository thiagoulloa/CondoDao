import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "@/lib/loading-context";
import { ContentProvider } from "@/lib/content-context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#1E1E1E]`}>
        <LoadingProvider>
          <AuthProvider>
            <ContentProvider>
              {children}
              <ToastContainer />
            </ContentProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
