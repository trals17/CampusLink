import type { Metadata } from 'next';
import { Poor_Story, Dongle, Gothic_A1, Hahmlet } from 'next/font/google';
import './globals.css';

const poor = Poor_Story({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--poor-text',
});

const hahmlet = Hahmlet({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal'],
  variable: '--hahmlet-text',
});

const dongle = Dongle({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | 운동감자',
    default: '운동감자',
  },
  description: 'Sell and buy all the things',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${hahmlet.className}
        max-w-screen-sm
        bg-stone-900 
        text-white 
        mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
