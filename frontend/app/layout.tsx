import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNavBar from "@/components/TopNavBar"; 
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recorriendo el Cerro | Eventos y Cultura",
  description: "Descubre los eventos culturales más importantes de Tegucigalpa.",
  keywords: ["eventos", "cultura", "Tegucigalpa", "conciertos", "teatro"],
  openGraph: {
    title: "Recorriendo el Cerro",
    description: "Explora los mejores eventos de la ciudad.",
    type: "website",
    url: "https://recorriendoelcerro.com",
    images: [
      {
        url: "/default-og.jpg",
        width: 1200,
        height: 630,
        alt: "Tegucigalpa Cultural",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recorriendo el Cerro",
    description: "Los mejores eventos culturales en Tegucigalpa.",
    images: ["/default-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopNavBar />
        <main>
          {children}
        </main>
        <Footer /> 
      </body>
    </html>
  );
}
