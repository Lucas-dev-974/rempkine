import { JSX } from "solid-js";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  text: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button(props: ButtonProps) {
  const { size = "md", ...rest } = props;
  return (
    <button
      class={`border border-transparent font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${sizeClasses[size]}`}
      {...rest}
    >
      {props.text}
    </button>
  );
}
