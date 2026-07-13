import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bantuan Ordal | Strategi Karir & Interview by Kelvin Sun",
  description: "Cari kerja bukan soal nasib, ini strateginya. Dapatkan kelas persiapan karir dengan akses eksklusif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090909] text-slate-200 selection:bg-rose-500/30">
        {children}
      </body>
    </html>
  );
}
