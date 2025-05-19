import { children } from "solid-js";

export function MainContent(props: { children: any }) {
  const childs = children(() => props.children);
  return (
    <div class="flex flex-col flex-1">
      <main> {childs()}</main>
    </div>
  );
}

export default MainContent;
