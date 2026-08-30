"use client";

import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import OAuthButtons from "@/components/utils/oauth-buttons";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name.trim().replace(/\s+/g, "_"),
          email,
          password
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        setError(
          data?.message ??
            (response.status === 400
              ? "Check your fields (username: 3-32 letters/numbers/underscores, password: 8+ characters)"
              : "Something went wrong. Try again.")
        );
        return;
      }

      router.push("/");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full min-h-dvh flex items-center justify-center py-10 px-5">
      <Form
        className="w-100 gap-3"
        noBg
        animation
        onSubmit={handleSubmit}>
        <Link
          href="/"
          className="aspect-square block w-15">
          <Image
            src="/logo.svg"
            alt="Nex0 Logo"
            width={100}
            height={100}
          />
        </Link>

        <Input
          label="Insert your name"
          placeholder="John Doe"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          darker />

        <Input
          label="Insert your email"
          placeholder="me@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          darker />

        <Input
          label="Create a password"
          placeholder="********"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          darker />

        <Input
          label="Confirm your password"
          placeholder="********"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          darker />

        <Button
          variant="primary"
          type="submit"
          size="w-full"
          className="text-sm p-2 mt-8">
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        <p
          className="text-xs w-full text-center">
          Do you have an account? <Link
            href="/signin"
            className="hover:underline hover:text-highlight duration-200 font-semibold">
            Sign In
          </Link>
        </p>

        <div
          className="w-full flex flex-col items-center justify-center text-sm mb-5 gap-3">
          Or continue with
          <OAuthButtons />
        </div>


        <p
          className="text-neutral-400 text-xs text-center">
          By signing up, you agree to our <Link
              href="/legal/tos"
              className="hover:underline hover:text-highlight duration-200 font-semibold">
              Terms of Service
            </Link> and <Link
              href="/legal/privacy"
              className="hover:underline hover:text-highlight duration-200 font-semibold">
              Privacy Policy
            </Link>.
        </p>

        <p
          className="text-neutral-400 text-xs text-center">
          Already have an account? <Link
              href="/signin"
              className="hover:underline hover:text-highlight duration-200 font-semibold">
              Sign In
            </Link>
        </p>
      </Form>
    </div>
  )
}
