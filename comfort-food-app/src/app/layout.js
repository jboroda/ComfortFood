import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Comfort Food Challenge — Tell Me Your Day, I'll Feed Your Soul",
  description: "Vent your stress and get matched with one perfect comfort dish and 6 ways to make or find it.",
  openGraph: {
    title: "Comfort Food Challenge — Tell Me Your Day, I'll Feed Your Soul",
    description: "Vent your stress and get matched with one perfect comfort dish and 6 ways to make or find it.",
    url: "https://comfort-food-git-main-jenny-borodas-projects.vercel.app",
    siteName: "Culinary Therapy Engine",
    images: [{ url: "/hero-grandma.png", width: 800, height: 600, alt: "Comfort Food Challenge" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comfort Food Challenge — Tell Me Your Day, I'll Feed Your Soul",
    description: "Vent your stress and get matched with one perfect comfort dish and 6 ways to make or find it.",
    images: ["/hero-grandma.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
