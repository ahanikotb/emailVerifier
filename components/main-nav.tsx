"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [pageLink, setPageLink] = useState<string>(window.location.pathname)
  useEffect(() => {
    setPageLink(window.location.pathname)
  }, [])
  const active = "text-sm font-medium transition-colors hover:text-primary"
  const inactive =
    "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        onClick={() => {
          setPageLink("/app/accounts")
        }}
        href="/app/accounts"
        className={pageLink.includes("/app/accounts") ? active : inactive}
      >
        Accounts
      </Link>
      <Link
        onClick={() => {
          setPageLink("/app/campaigns")
        }}
        href="/app/campaigns"
        className={pageLink.includes("/app/campaigns") ? active : inactive}
      >
        Campaigns
      </Link>
      <Link
        onClick={() => {
          setPageLink("/app/analytics")
        }}
        href="/app/analytics"
        className={pageLink.includes("/app/analytics") ? active : inactive}
      >
        Analytics
      </Link>
      <Link
        onClick={() => {
          setPageLink("/app/settings")
        }}
        href="/app/settings"
        className={pageLink.includes("/app/settings") ? active : inactive}
      >
        Settings
      </Link>
    </nav>
  )
}
