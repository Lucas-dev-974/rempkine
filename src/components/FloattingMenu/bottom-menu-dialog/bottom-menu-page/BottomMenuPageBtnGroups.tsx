import { DocsViewsEnum } from "./BottomMenuPageRouter";

interface BottomMenuPageBtnGroupsProps {
    changeCurrentDocsView: (view: DocsViewsEnum) => void;
    currentDocsView: DocsViewsEnum;
}

export function BottomMenuPageBtnGroups(props: BottomMenuPageBtnGroupsProps) {
    const PageBtnItems = [
        {
            title: "contrats",
            action: () => props.changeCurrentDocsView(DocsViewsEnum.contract),
            id: DocsViewsEnum.contract
        },
        // {
        //     title: "Exo fiche client",
        //     action: () => props.changeCurrentDocsView(DocsViewsEnum.clientFiles),
        //     id: DocsViewsEnum.clientFiles
        // },
    ]

    const activeStyle = "background: linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)";
    const inactiveStyle = "border: linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%) solid 1px";

    return (
        <div class="flex gap-2 justify-end  px-2">
            {PageBtnItems.map((view) => (
                <p class={"cursor-pointer rounded-full px-3 py-1  text-sm font-thin" + (props.currentDocsView == view.id ? " text-white" : " text-gray-500")} style={props.currentDocsView == view.id ? activeStyle : inactiveStyle} onClick={view.action}>
                    {view.title}
                </p>
            ))}
        </div>
    );
}