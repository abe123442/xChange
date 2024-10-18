"use client"

import * as React from "react"

import "./user-auth-form.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BACKEND_URL } from "@/lib/utils"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const { fname, lname, username, email, password } = (event.target as any).elements;

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div>
      <h1>
        Register
      </h1>
      <hr className="divider"></hr>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="flex items-center justify-center gap-3">
            <div>
              <Label className="sr-only" htmlFor="fname">
                First Name
              </Label>
              <Input
                id="fname"
                placeholder="First Name"
                type="text"
                autoCapitalize="none"
                autoComplete="on"
                autoCorrect="on"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="sr-only" htmlFor="lname">
                Last Name
              </Label>
              <Input
                id="lname"
                placeholder="Last Name"
                type="text"
                autoCapitalize="none"
                autoComplete="on"
                autoCorrect="on"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoComplete="on"
              autoCorrect="on"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} type="submit" className="button">
            {isLoading && (
              <img src="/images/spinner.png" className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  );
}