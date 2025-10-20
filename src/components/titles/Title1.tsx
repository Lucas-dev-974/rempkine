import { JSXElement } from "solid-js";

interface Title1Props {
  text: string;
  prevTextIcon?: JSXElement;
}

export function Title1(props: Title1Props) {
  return <h1 class="text-2xl md:text-5xl font-bold text-gray-800 font-[Nunito]">
    <span class="relative top-2">
      {props.prevTextIcon}
    </span>
    {props.text}
  </h1>;
}
