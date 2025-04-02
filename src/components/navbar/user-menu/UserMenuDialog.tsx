import storeService from "../../../utils/store.service";
import { setLoggedIn } from "../../../const.data";
import { UserMenuButton } from "./UserMenuButton";

import "./UserMenuDialog.css";

interface UserMenuDialogProps {
  openDialog: boolean;
}

export function UserMenuDialog(props: UserMenuDialogProps) {
  return (
    <div
      class="user-menu-dialog "
      classList={{
        hidden: !props.openDialog,
        visible: props.openDialog,
      }}
    >
      <UserMenuButton
        onClick={() => {
          setLoggedIn(false);
          storeService.proxy.isLogin = false;
          storeService.proxy.token = "";
          storeService.proxy.user = {};

          location.href = "/";
        }}
        text="Me déconnecté"
      />
    </div>
  );
}
