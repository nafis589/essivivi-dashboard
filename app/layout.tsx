import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "FlowCommerce - Point de vente et gestion pour petits commerçants",
  description: "Plateforme de point de vente et gestion d'entreprise pour petits commerçants. Gérez vos ventes, produits, clients et rapports en toute simplicité.",
  keywords: ["FlowCommerce", "Point de vente", "POS", "Commerce", "Gestion", "Petits commerçants", "France"],
  authors: [{ name: "FlowCommerce Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "FlowCommerce",
    description: "Point de vente et gestion pour petits commerçants",
    url: "https://flowcommerce.fr",
    siteName: "FlowCommerce",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
