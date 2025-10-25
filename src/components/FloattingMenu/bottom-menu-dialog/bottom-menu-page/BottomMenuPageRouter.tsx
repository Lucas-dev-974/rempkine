import { createSignal, Match, Switch } from "solid-js";
import { BottomMenuPageContract } from "./bottom-menu-pages/BottomMenuPageContract";
import { BottomMenuHeader } from "./BottomMenuHeader";
import { BottomMenuPageBtnGroups } from "./BottomMenuPageBtnGroups";

export enum DocsViewsEnum {
  contract = "contract",
  clientFiles = "fiches clients",
}

export interface DocsViewsItems {
  title: string;
  action: () => void;
}

export function BottomMenuPageRouter() {
  const [currentDocsView, setCurrentDocsView] = createSignal<DocsViewsEnum>(DocsViewsEnum.contract);
  const changeCurrentDocsView = (view: DocsViewsEnum) => setCurrentDocsView(view);


  return (
    <div>
      <BottomMenuHeader />

      <div class="px-2 xl:mx-40 ">
        <BottomMenuPageBtnGroups changeCurrentDocsView={changeCurrentDocsView} currentDocsView={currentDocsView()} />
        <Switch>
          <Match when={currentDocsView() == DocsViewsEnum.contract}>
            <BottomMenuPageContract />
          </Match>
          <Match when={currentDocsView() == DocsViewsEnum.clientFiles}>
            <div>Fiche clients</div>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
