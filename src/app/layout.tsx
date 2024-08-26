import "./globals.css";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth/next";
import SessionProvider from "./SessionProvider";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AIDesign",
  description: "Generate AI images from text descriptions",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white dark:bg-gray-900`}>
        <main className="flex-grow relative z-10">
          <SessionProvider session={session}>{children}</SessionProvider>
        </main>
        <Footer />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-C0C3WK0S97" />
      </body>
    </html>
  );
}