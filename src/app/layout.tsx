
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: '$GURU - Guru is here on Solana',
  description: 'The official website for Guru ($GURU) token on Solana.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Patrick+Hand&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="fixed inset-0 w-full h-full z-[-2]">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
            <source src="/BackgroundVid.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
