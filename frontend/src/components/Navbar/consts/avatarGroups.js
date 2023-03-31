import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";
import { Avatar } from "@mui/material";
import { useMemo } from "react";

export default function GroupImage() {
  const avatar = useMemo(() => {
    return createAvatar(style, {
      dataUri: true,
      size: 1280,
    });
  }, []);

  return <Avatar src={avatar} />;
}
