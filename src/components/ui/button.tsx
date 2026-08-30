import Link from "next/link";

interface Props {
  children: React.ReactNode;
  size: string;
  type?: "button" | "submit" | "reset" | "link";
  onClick?: () => void;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button(props: Props) {
  const variants = {
    "primary": {
     class: "bg-accent text-white"
    },
    "secondary": {
      class: "bg-white text-black"
    },
    "ghost": {
      class: ""
    }
  };

  const currentVariant = variants[props.variant ?? "primary"];

  return (
    props.type !== "link" && !props.href ?
      <button
        type={props.type ?? "button"}
        className={currentVariant.class + " rounded-sm text-center hover:brightness-75 duration-200 cursor-pointer " + props.className + " " + props.size}>
        {props.children}
      </button> :
      <Link
        href={props.href ?? "/"}
        className={currentVariant.class + " rounded-sm text-center hover:brightness-75 duration-200 " + props.className + " " + props.size}>
        {props.children}
      </Link>
  )
}
