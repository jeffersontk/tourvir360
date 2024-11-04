import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../globals.css";

const nissanBold = localFont({
  src: "../../fonts/NISSAN-BRAND-BOLD.otf",
  variable: "--font-nissan-bold",
  weight: "700",
});
const nissanRegular = localFont({
  src: "../../fonts/NISSAN-BRAND-REGULAR.otf",
  variable: "--font-geist-regular",
  weight: "200",
});
const nissanLight = localFont({
  src: "../../fonts/NISSAN-BRAND-LIGHT.otf",
  variable: "--font-geist-light",
  weight: "200",
});

export const metadata: Metadata = {
  title: "Tour Virtual Nissan",
  description: "Nissan Planta Rezende",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nissanBold.variable} ${nissanLight.variable}  ${nissanRegular.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
