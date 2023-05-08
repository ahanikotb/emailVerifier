"use client"

import { useRouter } from "next/navigation"
import { initUser } from "@/slices/userSlice"
import { useSignIn } from "react-auth-kit"
import { useDispatch } from "react-redux"

import Upreach from "@/lib/top_validator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export function Signin() {
  // const signIn = useSignIn()
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login To Your Account</CardTitle>
        <CardDescription>
          Enter your email below to log into your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            const res = await Upreach.signIn(
              //@ts-ignore
              document.getElementById("email").value,
              //@ts-ignore
              document.getElementById("password").value
            )

            dispatch(initUser(res))

            // signIn({
            //   token: res.token,
            //   expiresIn: 3600,
            //   tokenType: "Bearer",
            //   // authState: { ...res.user, token: res.token },
            // })
            router.push("/app/")

            // window.location.href = "/app"
            // //@ts-ignore
            // document.getElementById("email").value
            // //@ts-ignore
            // document.getElementById("password").value
          }}
          className="w-full"
        >
          Sign In
        </Button>
      </CardFooter>
    </Card>
  )
}
