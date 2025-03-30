import { createSignal, Match, Switch } from "solid-js";

enum DocsViewsEnum {
  contract = "contract",
  clientFiles = "fiches clients",
}

const [currentDocsView, setCurrentDocsView] = createSignal<DocsViewsEnum>(
  DocsViewsEnum.contract
);
const chageCurrentDocsView = (view: DocsViewsEnum) => setCurrentDocsView(view);

const docsViewsItems = [
  {
    title: "contrats",
    action: () => chageCurrentDocsView(DocsViewsEnum.contract),
  },
  {
    title: "fiches clients",
    action: () => chageCurrentDocsView(DocsViewsEnum.contract),
  },
];

export function BottomMenuDocs() {
  return (
    <div class="py-5 xl:mx-40">
      <p class="text-3xl font-semibold py-2">Mes documents</p>
      <div class="flex gap-2">
        {docsViewsItems.map((view) => (
          <p
            class="text-md px-3 py-2 border shadow-lg rounded-full cursor-pointer"
            onClick={view.action}
          >
            {view.title}
          </p>
        ))}
      </div>

      <Switch>
        <Match when={currentDocsView() == DocsViewsEnum.contract}>
          <div>Contrats</div>
        </Match>
        <Match when={currentDocsView() == DocsViewsEnum.clientFiles}>
          <div>Contrats</div>
        </Match>
      </Switch>
    </div>
  );
}
