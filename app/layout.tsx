import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InfraBunny - Cloud Resource Visualization",
  description: "Monitor and track your cloud infrastructure resources",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

