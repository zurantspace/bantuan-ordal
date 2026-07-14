import type { Metadata } from "next";
import Script from 'next/script';
import { Outfit, Anton } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
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
      className={`${outfit.variable} ${anton.variable} antialiased`}
    >
      <body className="bg-black text-slate-200 selection:bg-rose-500/30">
        {children}
        {/* Midtrans Snap.js — loaded globally so checkout popup works anywhere */}
        <Script
          src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
