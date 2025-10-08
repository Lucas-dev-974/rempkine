import { createSignal, Match, Switch } from "solid-js";
import { DocsViewContract } from "./bottom-menu-docs/DocsViewContract";

enum DocsViewsEnum {
  contract = "contract",
  clientFiles = "fiches clients",
}

export function BottomMenuDocs() {
  const [currentDocsView, setCurrentDocsView] = createSignal<DocsViewsEnum>(DocsViewsEnum.contract);
  const changeCurrentDocsView = (view: DocsViewsEnum) => setCurrentDocsView(view);

  const docsViewsItems = [
    {
      title: "contrats",
      action: () => changeCurrentDocsView(DocsViewsEnum.contract),
    },
  ];

  return (
    <div class="py-5 xl:mx-40">
      <p class="text-3xl font-semibold py-2">Mes documents</p>
      <div class="flex gap-2">
        {docsViewsItems.map((view) => (
          <p class="text-md px-3 py-2 border shadow-lg rounded-full cursor-pointer" onClick={view.action}>
            {view.title}
          </p>
        ))}
      </div>

      <Switch>
        <Match when={currentDocsView() == DocsViewsEnum.contract}>
          <DocsViewContract />
        </Match>
        <Match when={currentDocsView() == DocsViewsEnum.clientFiles}>
          <div>Fiche clients</div>
        </Match>
      </Switch>
    </div>
  );
}
