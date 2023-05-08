"use client"

import { sign } from "crypto"
import React from "react"
import { useRouter } from "next/navigation"
import { RootState } from "@/store/store"
import { useIsAuthenticated, useSignIn } from "react-auth-kit"
import { useSelector } from "react-redux"

import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { Signin } from "@/components/sign-in"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

interface RootLayoutProps {
  children: React.ReactNode
}
export default function Layout({ children }) {
  // const signIn = useSignIn()
  // const isAuthenticated = useIsAuthenticated()
  const { token, userData } = useSelector((state: RootState) => state.user)
  const router = useRouter()

  if (token == "") {
    router.push("/auth")
  }
  // if (!isAuthenticated()) {
  //   // signIn({
  //   //   token: token,
  //   //   tokenType: "",
  //   //   expiresIn: 0,
  //   // })
  //   // router.push("/auth")
  //   // Redirect to Dashboard
  // }
  return (
    <div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1>Top Email Validator</h1>
            {/* <TeamSwitcher /> */}
            {/* <MainNav className="mx-6" /> */}
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
