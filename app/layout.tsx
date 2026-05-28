import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORCHA - Visual AI Workflow OS",
  description: "Build AI systems visually with executable functions and real-time orchestration."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
