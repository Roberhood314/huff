import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Huff — Cảnh báo thiên tai thông minh",
  description: "Cảnh báo rủi ro thiên tai theo vị trí người dùng cấp quyền.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
