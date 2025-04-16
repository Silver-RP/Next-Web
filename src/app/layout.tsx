"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { NotificationProvider } from "../context/NotificationContext";
import { CartProvider } from "@/context/CartContext";

import { ReduxProvider } from "@/lib/redux/ReduxProvider";

import "@/styles/app/css/style.css";
import "@/styles/app/css/header.css";
import "@/styles/app/css/plugins/swiper.min.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isDashboard) return;

    document.body.className = "gradient-bg";

    const scripts = [
      "/assets/app/js/plugins/jquery.min.js",
      "/assets/app/js/plugins/bootstrap.bundle.min.js",
      "/assets/app/js/plugins/bootstrap-slider.min.js",
      "/assets/app/js/plugins/countdown.js",
      "/assets/app/js/plugins/swiper.min.js",
      "/assets/app/js/theme.js",
    ];

    scripts.forEach((src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    });

    return () => {
      document.body.className = "";
      scripts.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) script.remove();
      });
    };
  }, [isDashboard]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ReduxProvider>
        <NotificationProvider>
          <CartProvider>
            {!isDashboard && <Header />} 
            <Breadcrumb />
            <main>{children}</main>
            {!isDashboard && <Footer />}
          </CartProvider>
        </NotificationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
  
}
