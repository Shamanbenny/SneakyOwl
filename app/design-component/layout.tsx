import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Component",
};

export default function DesignComponentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
