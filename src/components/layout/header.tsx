import Image from "next/image"

export default function Header() {
  return (
    <header
      className="flex justify-between items-center p-3 px-5 sticky top-0 backdrop-blur animate-fade-in-down border-b border-neutral-950">
      <Image
      src="/large.svg"
      alt="Large logo"
      width={300}
      height={300}
      className="h-8 w-max" />

      <div
      className="flex gap-2 items-center justify-center">
        <button
        className="bg-accent hover:bg-hover duration-300 cursor-pointer p-1.5 text-sm w-24 rounded-sm">
          Sign in
        </button>
      </div>
    </header>
  )
}
