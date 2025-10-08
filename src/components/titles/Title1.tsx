import { JSXElement } from "solid-js";

interface Title1Props {
  text: string;
  prevTextIcon?: JSXElement;
}

export function Title1(props: Title1Props) {
  return <h1 class="text-2xl md:text-5xl font-bold text-gray-800 font-[Nunito]">{props.prevTextIcon}{props.text}</h1>;
}
