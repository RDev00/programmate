interface Props {
  children?: React.ReactNode;
  onSubmit?: () => void;
  onReset?: () => void;
  onError?: () => void;
  className?: string;
  noBg?: boolean;
  animation?: boolean;
}

export default function Form(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      onReset={props.onReset}
      onError={props.onError}
      className={props.className + (props.noBg ? "" : " rounded-sm bg-neutral-950") + " px-3 py-4 flex flex-col items-center justify-center" + (props.animation && " animate-fade-in-up")}>

      {props.children}
    </form>
  )
}
