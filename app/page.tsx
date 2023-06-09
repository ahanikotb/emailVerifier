"use client"

import { Metadata } from "next"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Activity, CreditCard, DollarSign, Download, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { MainNav } from "@/components/main-nav"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Search } from "@/components/search"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

// export const metadata: Metadata = {
//   title: "Home",
//   description: "Example dashboard app using the components.",
// }

export default function DashboardPage() {
  useRouter().push("/auth")
  return <></>
}
