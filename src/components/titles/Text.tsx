interface TextProps {
  text: string;
}

export function Text(props: TextProps) {
  return <p class="text-xs sm:text-sm md:text-base text-gray-700 font-[Nunito] m-0">{props.text}</p>;
}
