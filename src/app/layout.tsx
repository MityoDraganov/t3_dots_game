// src/app/layout.tsx
import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import NavBar from "./_components/navbar";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  PageProps,
}: {
  children: React.ReactNode;
  PageProps: any;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="h-full">
        <TRPCReactProvider>
          <ClerkProvider {...PageProps}>
            <NavBar />
            <main className="h-full">{children}</main>
          </ClerkProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
