import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/ui/Providers"
import { Navbar } from "@/components/ui/Navbar"

export const metadata: Metadata = {
  title: "StockTH - วิเคราะห์การลงทุน SET & S&P500",
  description: "เครื่องมือวิเคราะห์หุ้นไทย SET และตลาดสหรัฐ S&P 500",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
