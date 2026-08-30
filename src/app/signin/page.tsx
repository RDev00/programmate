"use client";

import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";

import {
  IconBrandGithub,
  IconBrandGitlab, IconBrandGoogleFilled
} from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

export default function SignInPage() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  return (
    <div
      className="w-full min-h-dvh flex items-center justify-center py-10 px-5">
      <Form
        className="w-100 gap-3"
        noBg
        animation>
        <Image
          src="/logo.svg"
          alt="Nex0 Logo"
          width={100}
          height={100}
          className="aspect-square block w-15"
        />

        <Input
          label="Insert your email"
          placeholder="me@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          darker />

        <Input
          label="Insert your password"
          placeholder="********"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          darker />

        <Button
          variant="primary"
          type="submit"
          size="w-full"
          className="text-sm p-2 mt-8">
          Sign In
        </Button>

        <div
          className="w-full flex flex-col items-center justify-center text-sm mb-5 gap-3">
          Or continue with
          <div
            className="flex justify-between items-center w-full">
            <Button
              variant="ghost"
              type="button"
              size="w-28"
              className="border border-neutral-900 p-2 flex items-center justify-center hover:bg-neutral-900">
              <IconBrandGoogleFilled
              color="#FAFAFA"/>
            </Button>
            <Button
              variant="ghost"
              type="button"
              size="w-28"
              className="border border-neutral-900 p-2 flex items-center justify-center hover:bg-neutral-900">
              <IconBrandGithub
              color="#FAFAFA"/>
            </Button>
            <Button
              variant="ghost"
              type="button"
              size="w-28"
              className="border border-neutral-900 p-2 flex items-center justify-center hover:bg-neutral-900">
              <IconBrandGitlab
              color="#FAFAFA"/>
            </Button>
          </div>
        </div>


        <p
          className="text-neutral-400 text-xs text-center">
          By signing in, you agree to our <Link
              href="/legal/tos"
              className="hover:underline hover:text-highlight duration-200 font-semibold">
              Terms of Service
            </Link> and <Link
              href="/legal/privacy"
              className="hover:underline hover:text-highlight duration-200 font-semibold">
              Privacy Policy
            </Link>.
        </p>
      </Form>
    </div>
  )
}
