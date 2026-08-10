import type { Metadata } from "next";
import { Judson, Instrument_Sans } from "next/font/google";
import { CartProvider } from "@/components/context/CartContext";
import CookieBanner from "@/components/shared/CookieBanner";
import MobileStickyCart from "@/components/shared/MobileStickyCart";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";
import CartDrawer from "@/components/shared/CartDrawer";
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
  title: "Tylicious Grillz | BBQ Catering London & Kent | African Grill & Seafood",
  description: "Experience premium African BBQ catering, Ghanaian wedding catering, and sizzling grilled seafood in London & Kent. Operational for pre-orders & events.",
  keywords: ["BBQ Catering London", "BBQ Catering Kent", "Ghanaian Wedding Catering", "African BBQ Catering", "grilled fish", "seafood platter", "tilapia", "croaker fish"],
  authors: [{ name: "Tylicious Grillz" }],
  openGraph: {
    title: "Tylicious Grillz | Premium BBQ Catering London & Kent",
    description: "Premium African BBQ Catering & Grilled Seafood Delivered Fresh across London & Kent.",
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
      <head>
        {/* SEO local establishment Schema Markup (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodEstablishment",
              "name": "Tylicious Grillz",
              "image": "https://tyliciousgrillz.com/images/Gemini_Generated_Image_cibfydcibfydcibf.png",
              "url": "https://tyliciousgrillz.com",
              "telephone": "+441234567890",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "London & Kent Service Area",
                "addressLocality": "London",
                "addressRegion": "Kent",
                "postalCode": "ME14",
                "addressCountry": "GB"
              },
              "servesCuisine": "African BBQ, Grilled Seafood",
              "priceRange": "££",
              "description": "Premium BBQ Catering and Sizzling Grilled Seafood in London & Kent. Specializing in Ghanaian Wedding Catering, African BBQ Catering, and Private Event catering."
            })
          }}
        />

        {/* GA4 analytics scripts */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', { page_path: window.location.pathname });
            `
          }}
        />

        {/* Meta Pixel tracking scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'XXXXXXXXXXXXXXX');
              fbq('track', 'PageView');
            `
          }}
        />
      </head>
      <body
        className={`${judson.variable} ${instrumentSans.variable} font-sans bg-brand-bg text-brand-brown antialiased selection:bg-brand-orange selection:text-white`}
      >
        <CartProvider>
          {children}
          <CookieBanner />
          <CartDrawer />
          <MobileStickyCart />
          <WhatsAppWidget />
        </CartProvider>
      </body>
    </html>
  );
}
