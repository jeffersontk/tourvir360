import { AppStateProvider } from "@/context/AppStateContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import {EditPageProvider} from '../../../context/edit/editPageContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Editor Tour - Ambiente",
  description: "Editor Tour - Ambiente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </body>
    </html>
  );
}
