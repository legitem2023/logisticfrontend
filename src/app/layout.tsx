import { metadata as baseMetadata } from './components/seo';
export const metadata = baseMetadata;
import LoadEruda from './LoadEruda';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReduxWrapper from "./components/ApolloProvider/ReduxWrapper"; 
import { SessionProvider } from "next-auth/react";
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
        <TokenSyncer/>
       <SessionProvider>
         <ReduxWrapper>{children}</ReduxWrapper>
       </SessionProvider>
      </body>
    </html>
  );
}
