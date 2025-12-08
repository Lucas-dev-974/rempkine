import { JSX } from "solid-js";

export interface TableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (item: T, index: number) => JSX.Element;
}

