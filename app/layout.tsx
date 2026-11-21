import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["vietnamese", "latin"], weight: ["500", "700", "800"] });

export const metadata: Metadata = {
  title: "Bida Phú Ông",
  description: "Tính điểm bida cho hội An, Tôn, Tú",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body
        className={`${baloo.className} h-dvh touch-manipulation overscroll-none bg-[radial-gradient(circle_at_50%_30%,#0f5a3c,#083a27)] text-[#f4f7ef]`}
      >
        {children}
      </body>
    </html>
  );
}
