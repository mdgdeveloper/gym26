import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fitness Tracker",
  description: "Tu tracker personal de entrenamiento",
  viewport: "width=device-width, initial-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable}`} style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[480px] mx-auto min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
