import type { Metadata } from "next";
import { Judson, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Tylicious Grillz | African BBQ Catering London, Kent & Essex | Grilled Seafood",
  description:
    "Tylicious Grillz delivers premium African BBQ catering, Ghanaian wedding catering, and sizzling grilled seafood across London, Kent & Essex. Serving Gravesend, Dartford, Maidstone, Chatham, Grays, Basildon & more. Book your event today.",
  keywords: [
    // Brand
    "Tylicious Grillz",
    "Tylicious Grillz catering",
    // Service types
    "BBQ Catering London",
    "BBQ Catering Kent",
    "BBQ Catering Essex",
    "African BBQ Catering",
    "Ghanaian Wedding Catering",
    "Ghanaian event catering London",
    "African food catering London",
    "grilled fish London",
    "grilled seafood London",
    "seafood platter London",
    "tilapia London",
    "croaker fish London",
    "event catering Kent",
    "event catering Essex",
    "private event catering London",
    // London boroughs / areas
    "BBQ catering North London",
    "BBQ catering South London",
    "BBQ catering East London",
    "BBQ catering West London",
    "BBQ catering Central London",
    "BBQ catering South-East London",
    // Kent towns
    "BBQ catering Gravesend",
    "BBQ catering Dartford",
    "BBQ catering Maidstone",
    "BBQ catering Rochester",
    "BBQ catering Chatham",
    "BBQ catering Gillingham",
    "BBQ catering Canterbury",
    "BBQ catering Sittingbourne",
    "BBQ catering Ashford",
    "BBQ catering Folkestone",
    "BBQ catering Margate",
    "catering Northfleet",
    "catering Ebbsfleet",
    "catering Greenhithe",
    "catering Swanscombe",
    "catering Sevenoaks",
    "catering Strood",
    "catering Rainham Kent",
    "catering Tonbridge",
    "catering Tunbridge Wells",
    "catering Faversham",
    "catering Dover",
    "catering Ramsgate",
    "catering Broadstairs",
    // Essex towns
    "BBQ catering Grays",
    "BBQ catering Thurrock",
    "BBQ catering Basildon",
    "BBQ catering Romford",
    "BBQ catering Chelmsford",
    "BBQ catering Southend",
    "catering Tilbury",
    "catering Brentwood",
    "catering Hornchurch",
    "catering Upminster",
    "catering Dagenham",
    "catering Barking",
    "catering Colchester",
    "catering Harlow",
    "catering Braintree",
    "catering Witham",
  ],
  authors: [{ name: "Tylicious Grillz" }],
  icons: {
    icon: "/images/logo2.webp",
    shortcut: "/images/logo2.webp",
    apple: "/images/logo2.webp",
  },
  openGraph: {
    title: "Tylicious Grillz | Premium African BBQ Catering – London, Kent & Essex",
    description:
      "Premium African BBQ Catering & Grilled Seafood delivered fresh across London, Kent & Essex. Ghanaian wedding catering & private event specialists.",
    images: ["/images/Gemini_Generated_Image_cibfydcibfydcibf.png"],
    type: "website",
    siteName: "Tylicious Grillz",
    locale: "en_GB",
    url: "https://tyliciousgrillz.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tylicious Grillz | African BBQ Catering London, Kent & Essex",
    description:
      "Premium African BBQ Catering & Grilled Seafood across London, Kent & Essex.",
    images: ["/images/Gemini_Generated_Image_cibfydcibfydcibf.png"],
  },
  alternates: {
    canonical: "https://tyliciousgrillz.com",
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
        <link rel="icon" href="/images/logo2.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/images/logo2.webp" />
        {/* SEO local establishment Schema Markup (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["FoodEstablishment", "CateringBusiness"],
              "name": "Tylicious Grillz",
              "image": "https://tyliciousgrillz.com/images/Gemini_Generated_Image_cibfydcibfydcibf.png",
              "logo": "https://tyliciousgrillz.com/images/logo2.webp",
              "url": "https://tyliciousgrillz.com",
              "telephone": "+447597934557",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "London, Kent & Essex Service Area",
                "addressLocality": "London",
                "addressRegion": "Greater London",
                "addressCountry": "GB"
              },
              "areaServed": [
                { "@type": "City", "name": "London" },
                // London areas
                "North London", "South London", "East London", "West London",
                "Central London", "South-East London",
                // Kent
                { "@type": "City", "name": "Gravesend" },
                { "@type": "City", "name": "Dartford" },
                { "@type": "City", "name": "Maidstone" },
                { "@type": "City", "name": "Rochester" },
                { "@type": "City", "name": "Chatham" },
                { "@type": "City", "name": "Gillingham" },
                { "@type": "City", "name": "Canterbury" },
                { "@type": "City", "name": "Sittingbourne" },
                { "@type": "City", "name": "Ashford" },
                { "@type": "City", "name": "Folkestone" },
                { "@type": "City", "name": "Margate" },
                { "@type": "City", "name": "Northfleet" },
                { "@type": "City", "name": "Ebbsfleet" },
                { "@type": "City", "name": "Greenhithe" },
                { "@type": "City", "name": "Swanscombe" },
                { "@type": "City", "name": "Sevenoaks" },
                { "@type": "City", "name": "Strood" },
                { "@type": "City", "name": "Tonbridge" },
                { "@type": "City", "name": "Tunbridge Wells" },
                { "@type": "City", "name": "Faversham" },
                { "@type": "City", "name": "Dover" },
                { "@type": "City", "name": "Ramsgate" },
                { "@type": "City", "name": "Broadstairs" },
                // Essex
                { "@type": "City", "name": "Grays" },
                { "@type": "City", "name": "Thurrock" },
                { "@type": "City", "name": "Tilbury" },
                { "@type": "City", "name": "Basildon" },
                { "@type": "City", "name": "Brentwood" },
                { "@type": "City", "name": "Romford" },
                { "@type": "City", "name": "Hornchurch" },
                { "@type": "City", "name": "Chelmsford" },
                { "@type": "City", "name": "Colchester" },
                { "@type": "City", "name": "Harlow" },
                { "@type": "City", "name": "Braintree" },
                { "@type": "City", "name": "Witham" }
              ],
              "servesCuisine": ["African BBQ", "Ghanaian", "Grilled Seafood", "West African"],
              "priceRange": "££",
              "hasMap": "https://maps.google.com",
              "sameAs": [
                "https://www.facebook.com/Tyliciousgrillz",
                "https://www.instagram.com/tyliciousgrillz",
                "https://www.tiktok.com/@tyliciousgrillz"
              ],
              "description": "Tylicious Grillz offers premium African BBQ catering, Ghanaian wedding catering, and grilled seafood events across London, Kent & Essex. Specialising in private events, corporate catering, and pre-order delivery."
            })
          }}
        />

        {/* GA4 analytics scripts (if configured) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
                `
              }}
            />
          </>
        )}

        {/* Meta Pixel tracking scripts (if configured) */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
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
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                fbq('track', 'PageView');
              `
            }}
          />
        )}
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
        <Analytics />
      </body>
    </html>
  );
}
