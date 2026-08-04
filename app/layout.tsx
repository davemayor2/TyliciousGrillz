import type { Metadata } from "next";
import { Judson, Instrument_Sans } from "next/font/google";
import "./globals.css";

const judson = Judson({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-judson",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "Tylicious Grillz | Premium Grilled Seafood & BBQ Delivered Fresh",
  description: "Experience the best grilled seafood, tilapia, croaker fish, and smoked BBQ ribs in town. Delivered fresh, hot, and delicious to your doorstep.",
  keywords: ["grilled fish", "seafood platter", "BBQ ribs", "Tylicious Grillz", "delivery", "tilapia", "croaker fish"],
  authors: [{ name: "Tylicious Grillz" }],
  openGraph: {
    title: "Tylicious Grillz | Premium Grilled Seafood & BBQ",
    description: "Premium Grilled Seafood & BBQ Delivered Fresh To Your Doorstep.",
    images: ["/images/Gemini_Generated_Image_cibfydcibfydcibf.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${judson.variable} ${instrumentSans.variable} font-sans bg-brand-bg text-brand-brown antialiased selection:bg-brand-orange selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
