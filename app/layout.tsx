import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import FirebaseAuthBootstrap from "@/app/components/shared/auth/FirebaseAuthBootstrap";
import { NotificationProvider } from "@/app/components/shared/feedback/NotificationProvider";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./globals.css";

const bodyFont = Ubuntu_Mono({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SneakyOwl",
    template: "%s | SneakyOwl",
  },
  icons: {
    icon: "/fevicon.png",
    shortcut: "/fevicon.png",
    apple: "/fevicon.png",
  },
};

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
        <meta name="keywords" content="SneakyOwl's Personal Website" />
        <meta name="author" content="SneakyOwl" />
      </head>
      <body className={bodyFont.className}>
        <NotificationProvider>
          <FirebaseAuthBootstrap />
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
