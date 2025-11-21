import { setLoggedIn } from "../../../const.data";
import storeService from "../../../utils/store.service";
import { UserMenuButton } from "./UserMenuButton";
import { useNavigate } from "@solidjs/router";

interface UserMenuDialogProps {
  openDialog: boolean;
}

export function UserMenuDialog(props: UserMenuDialogProps) {
  const navigate = useNavigate();

  return (
    <div
      class="absolute top-10  right-2 p-3  rounded-md shadow-lg"
      style={{ "background": "linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)" }}
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

          navigate("/");
        }}
        text="Me déconnecté"
      />
    </div>
  );
}
