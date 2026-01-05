import localFont from "next/font/local";
import SessionProviderWrapper from "./components/auth/SessionProviderWrapper";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import "./styles/globals.css";
import "./styles/style.css";
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import Script from "next/script";
import { CartProvider } from "./context/CartContext";


export const metadata = {
  title: "فروشگاه اینترنتی",
  description: "آنلاین شاپ",
};

const iranSans = localFont({
  src: [
    {
      path: "./fonts/IRANSans/IRANSansweb_Light.woff",
      weight: "300",
      style: "normal",
    },

    {
      path: "./fonts/IRANSans/IRANSansweb_Medium.woff",
      weight: "500",
      style: "normal",
    },

    {
      path: "./fonts/IRANSans/IRANSansweb_Bold.woff",
      weight: "700",
      style: "normal",
    },

    {
      path: "./fonts/IRANSans/IRANSansweb_UltraLight.woff",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iranSans.variable}>
      <head>
        <link rel="stylesheet" href="/plugins/owlcarousel/assets/owl.carousel.min.css" />
        <link rel="stylesheet" href="/plugins/owlcarousel/assets/owl.theme.default.min.css" />
        <link rel="stylesheet" href="/fonts/fontawesome/css/all.min.css" />
      
      <Script src="/js/jquery-3.5.1.min.js" strategy="beforeInteractive" />
      <Script src="/js/popper.js" strategy="beforeInteractive" />
      </head>
      <body>
        <SessionProviderWrapper>
        <CartProvider>
        <Header  />
          <main>
            {children}
          </main>
          <Footer  />
          </CartProvider>
        </SessionProviderWrapper>
      <Script src="/plugins/owlcarousel/owl.carousel.min.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
