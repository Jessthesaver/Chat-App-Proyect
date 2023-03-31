import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Image() {
  const { avatar } = useSelector((state) => state.user.value);

  if (avatar) {
    return <Avatar src={avatar} />;
  } else {
    return <Avatar src={AccountCircleIcon} />;
  }
}
