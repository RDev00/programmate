import Image from "next/image";
import Link from "next/link";

import Button from "../ui/button";

export default function Header() {
  return (
    <header
      className="flex justify-between items-center p-3 px-5 sticky top-0 backdrop-blur animate-fade-in-down border-b border-neutral-950">
      <Link
        href="/">
        <Image
        src="/large.svg"
        alt="Large logo"
        width={300}
        height={300}
        className="h-8 w-max"
        loading="eager" />
      </Link>

      <div
        className="flex gap-2 items-center justify-center">
        <Button
          type="link"
          href="/signin"
          variant="primary"
          size="w-25"
          className="text-sm p-2">
          Sign in
        </Button>
      </div>
    </header>
  )
}
