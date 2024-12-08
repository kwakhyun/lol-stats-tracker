import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 로컬 폰트 설정
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// 메타데이터 설정
export const metadata: Metadata = {
  title: "승리의 발자취",
  description: "Track your League of Legends stats and performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="min-h-screen flex flex-col">
          {/* 헤더 */}
          <header className="bg-blue-950 text-white">
            <nav className="container mx-auto px-4 py-3 tablet:py-4 desktop:py-5">
              <h1 className="text-lg tablet:text-xl desktop:text-2xl font-bold">
                승리의 발자취 - 리그 오브 레전드 전적 분석
              </h1>
            </nav>
          </header>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 container mx-auto px-4 py-6 tablet:py-8 desktop:py-12">
            {children}
          </main>

          {/* 푸터 */}
          <footer className="bg-gray-800 text-white text-center">
            <div className="container mx-auto px-4 py-4 tablet:py-6 desktop:py-8">
              <p className="text-sm tablet:text-md">
                © 2024 LOL Stats Tracker. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
