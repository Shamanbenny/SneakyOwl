import { Exo } from "next/font/google";
import "./globals.css";
import Loader from "./Loader";

const inter = Exo({ subsets: ["latin"] });

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
        <link rel="icon" href="/fevicon.png" type="image/gif" />
        <meta name="keywords" content="SneakyOwl's Personal Website" />
        <meta name="author" content="SneakyOwl" />
        <title>SneakyOwl</title>
      </head>
      <body className={inter.className}>
        <div
          className="spinner"
          style={{ opacity: "1", transition: "opacity 1s" }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
        <Loader />
        <div className="apps" style={{ display: "none" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
