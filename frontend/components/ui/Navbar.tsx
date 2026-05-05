"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/", label: "ภาพรวม" },
  { href: "/compare", label: "เปรียบเทียบ" },
  { href: "/market", label: "ตลาด" },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg shrink-0">
          <span className="text-blue-600">📈</span>
          <span>StockTH</span>
        </Link>
        <div className="flex gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === n.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
