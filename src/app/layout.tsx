import type { Metadata } from "next";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DataInitializer from '@/components/DataInitializer'
import "./globals.scss";

export const metadata: Metadata = {
  title: "EduFind",
  description: "학원 자격증 통합 검색 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body>
        <DataInitializer />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
