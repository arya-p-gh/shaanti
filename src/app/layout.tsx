import React from 'react';
import type { Metadata } from 'next';
import { Poppins, Playfair_Display, Noto_Sans } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const notoSans = Noto_Sans({
  weight: ['400', '700'],
  subsets: ['latin', 'devanagari'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shaanti - Mindful Breathing App',
  description: 'Shaanti helps you practice mindful breathing with customizable patterns and soothing sounds.',
  icons: {
    icon: [
      { url: '/lotus.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lotus.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${poppins.variable} ${playfair.variable} ${notoSans.variable} font-sans`}>{children}</body>
    </html>
  );
} 