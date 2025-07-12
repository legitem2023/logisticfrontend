import { metadata as baseMetadata, viewport as baseViewport } from './components/seo'; // Import both
export const metadata = baseMetadata;
export const viewport = baseViewport; // Add viewport export

import LoadEruda from './LoadEruda';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReduxWrapper from "./components/ApolloProvider/ReduxWrapper"; 
import AuthProvider from "./components/Auth/AuthProvider";
import TokenSyncer from "./components/TokenSyncer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadEruda/>
        <AuthProvider>
          <TokenSyncer/>
          <ReduxWrapper>{children}</ReduxWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
