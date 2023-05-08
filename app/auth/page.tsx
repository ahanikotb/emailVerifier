import { Metadata } from "next"
import Image from "next/image"
import { Activity, CreditCard, DollarSign, Download, Users } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Signin } from "@/components/sign-in"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

export default function DashboardPage() {
  return (
    <>
      <div className={cn("grid min-h-screen place-items-center")}>
        <Signin></Signin>
      </div>
    </>
  )
}
