import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Kaiseki OS MVP",
    description: "A simple measurement OS with Easy Mode",
};

import { TerminologyProvider } from "@/lib/terminology";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={`${inter.className} min-h-screen bg-background antialiased`}>
                <TerminologyProvider>
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </TerminologyProvider>
            </body>
        </html>
    );
}
