"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import HeadComponent from "@/components/dashboard/head";
import Script from "next/script";
import { NotificationProvider } from "../../context/NotificationContext";

import "@/styles/admin/css/animate.min.css";
import "@/styles/admin/css/animation.css";
import "@/styles/admin/css/bootstrap-select.min.css";
import "@/styles/admin/css/bootstrap.css";
import "@/styles/admin/css/custom.css";
import "@/styles/admin/css/style.css";
import "@/styles/admin/css/sweetalert.min.css";

import "./dashboard.css";

// ApexCharts không hỗ trợ SSR nên cần dùng dynamic import
// const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });

export default function AdminLayout({
  
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const scriptsLoaded = useRef(false);
  //   const chartRef = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (scriptsLoaded.current) return;
    scriptsLoaded.current = true;

    document.body.classList.add("gradient-bg");

    const scriptUrls = [
      "/assets/admin/js/jquery.min.js",
      "/assets/admin/js/bootstrap.min.js",
      "/assets/admin/js/bootstrap-select.min.js",
      "/assets/admin/js/sweetalert.min.js",
      "/assets/admin/js/apexcharts/apexcharts.js",
    ];

    const scriptElements: HTMLScriptElement[] = [];

    const loadScriptsSequentially = async () => {
      for (const src of scriptUrls) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(`Failed to load: ${src}`);
          document.body.appendChild(script);
          scriptElements.push(script);
        });
      }
    };

    loadScriptsSequentially().catch(console.error);

    return () => {
      document.body.classList.remove("gradient-bg");
      scriptElements.forEach((script) => script.remove());
      //   chartRef.current?.destroy();
    };
  }, []);

  return (

    <NotificationProvider>
      <>
        <HeadComponent />
        <Script src="/assets/admin/js/jquery.min.js" strategy="lazyOnload" />
        <Script src="/assets/admin/js/bootstrap.min.js" strategy="lazyOnload" />
        <Script
          src="/assets/admin/js/bootstrap-select.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="/assets/admin/js/sweetalert.min.js"
          strategy="lazyOnload"
        />

        <div className="body">
          <div id="wrapper">
            <div id="page">
              <div className="layout-wrap">
                <Sidebar />
                <div className="section-content-right">
                  <Header />
                  <div className="main-content">
                    {children}
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </NotificationProvider>
  );
}
