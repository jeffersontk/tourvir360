import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppStateProvider } from "@/context/AppStateContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Editor Tour - Editar Ambiente",
  description: "Editor Tour - Editar Ambiente",
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
