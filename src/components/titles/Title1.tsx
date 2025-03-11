import "./Title1.css";

interface Title1Props {
  text: string;
}

export function Title1(props: Title1Props) {
  return <h1 class="title-1">{props.text}</h1>;
}
