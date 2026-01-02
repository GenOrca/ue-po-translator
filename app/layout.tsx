import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UE PO Translator",
  description: "AI-powered translation tool for Unreal Engine PO localization files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
