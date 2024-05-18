import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";

const bodyFont = Ubuntu_Mono({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="icon" href="./fevicon.png" type="image/gif" />
        <meta name="keywords" content="SneakyOwl's Personal Website" />
        <meta name="author" content="SneakyOwl" />
        <title>SneakyOwl</title>
      </head>
      <body className={bodyFont.className + " dark"}>{children}</body>
    </html>
  );
}
