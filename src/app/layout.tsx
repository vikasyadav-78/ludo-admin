import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Gaming Battle Platform - Admin Panel',
  description: 'Administration panel of the Gaming Battle Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
