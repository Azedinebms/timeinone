import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

import Footer from "@/components/layout/Footer";

import {
  ToastProvider,
} from "@/components/ui/toast";

import {
  createDefaultMetadata,
  createGlobalJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata:
  Metadata =
  createDefaultMetadata();

export const viewport:
  Viewport = {
  width:
    "device-width",

  initialScale:
    1,

  maximumScale:
    5,

  themeColor:
    "#f4f7fd",

  colorScheme:
    "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  const globalJsonLd =
    createGlobalJsonLd();

  return (
    <html
      lang="en"
      className="bg-background"
    >
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              serializeJsonLd(
                globalJsonLd,
              ),
          }}
        />

        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>

            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}