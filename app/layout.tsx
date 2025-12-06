import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InfraBunny - Cloud Resource Visualization",
  description: "Monitor and track your cloud infrastructure resources",
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

