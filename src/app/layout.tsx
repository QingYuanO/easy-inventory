import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import localFont from "next/font/local";
const lxgw = localFont({
  src: [
    {
      path: "./fonts/LXGWWenKaiLite-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LXGWWenKaiLite-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-lxgw",
});

export const metadata = {
  title: " Easy清单",
  description: "易于使用的货物清单管理",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-background text-foreground ${lxgw.className}`}>
        <NextAuthProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
