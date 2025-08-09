import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Readex_Pro } from "next/font/google"

interface FooterProps {
  logo?: React.ReactNode
  brandName?: string
  socialLinks?: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks?: Array<{
    href: string
    label: string
  }>
  legalLinks?: Array<{
    href: string
    label: string
  }>
  copyright?: {
    text: string
    license?: string
  }
}

const readexPro = Readex_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-readex-pro",
})

export default function Footer({
  logo = <Image src="/logo-flat-transparent.png" alt="Logo" width={32} height={32} className="h-8 w-auto" />,
  brandName = "AsimovAI",
  socialLinks = [],
  mainLinks = [
    { href: "#", label: "Gallery" },
    { href: "#", label: "Pricing" },
    { href: "#", label: "About" },
    { href: "#", label: "Contact" }
  ],
  legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" }
  ],
  copyright = {
    text: "© 2025 AsimovAI. All rights reserved."
  }
}: FooterProps = {}) {
  return (
    <footer className={`w-full pb-6 pt-16 lg:pb-8 lg:pt-24 px-18 backdrop-blur-4xl border-t border-white/30 bg-gradient-to-b from-[#451cff]/30 via-violet-700/0 to-black/0 ${readexPro.className}`}>
      <div className="w-full px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <Link href="/" className={`flex items-center gap-x-2 ${readexPro.className}`}>
            {logo}
            <span className={`font-light text-xl text-white ${readexPro.className}`}>{brandName}</span>
          </Link>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-white/10 mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className={`text-sm text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors duration-200 ${readexPro.className}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className={`text-sm text-white/60 hover:text-white/80 underline-offset-4 hover:underline transition-colors duration-200 ${readexPro.className}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={`mt-6 text-sm leading-6 text-white/60 whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4] ${readexPro.className}`}>
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  )
}
