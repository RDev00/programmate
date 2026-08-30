"use client";

import { useState } from "react";

import {
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react"

interface Props {
  label: string;
  value: string;
  type?: "text" | "password" | "email" | "number" | "date" | "time" | "datetime-local" | "url" | "search" | "tel";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  pattern?: string;
  darker?: boolean;
}

export default function Input(props: Props) {
  const [ isVisible, setIsVisible ] = useState(false);

  return (
    props.type && props.type === "password" ?
      <div
        className={props.className ?? "text-sm w-full" + " relative flex flex-col items-start justify-start"}>
        <label
          className={props.labelClassName}>
          {props.label}
        </label>

        <input
          type={isVisible ? "text" : "password"}
          className={(props.inputClassName ?? "w-full text-start flex items-center justify-center border border-transparent outline-none duration-200 focus:border-accent px-3 py-2 rounded-sm mt-1 ") + (props.darker ? "bg-neutral-950" :"bg-neutral-800")}
          onChange={(e) => props.onChange(e)}
          pattern={props.pattern}
          value={props.value} />

        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-sm absolute right-2 bottom-1.5 hover:underline cursor-pointer">
          {isVisible ? <IconEyeOff stroke={1.5} /> : <IconEye stroke={1.5} />}
        </button>
      </div> :
      <div
        className={props.className ?? "text-sm w-full" + " relative flex flex-col items-start justify-start"}>
        <label
          className={props.labelClassName}>
          {props.label}
        </label>

        <input
          type={props.type ?? "text"}
          className={(props.inputClassName ?? "w-full text-start flex items-center justify-center bg-neutral-800 border border-transparent outline-none duration-200 focus:border-accent invalid:border-red-500 px-3 py-2 rounded-sm mt-1 ") + (props.darker ? "bg-neutral-950" :"bg-neutral-800")}
          onChange={(e) => props.onChange(e)}
          pattern={props.pattern}
          value={props.value} />
      </div>
  )
}
