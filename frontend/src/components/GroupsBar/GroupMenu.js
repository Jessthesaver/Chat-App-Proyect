import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu } from "@mui/material";
import { useSelector } from "react-redux";
import AdminGroupOptions from "./AdminGroupOptions";
import MemberGroupOptions from "./MemberGroupOptions";

const GroupMenu = ({ id }) => {
  const { username, rooms } = useSelector((state) => state.user.value);
  const [anchorEl, setAnchorEl] = useState(null);

  let currentChat, isAdmin;

  currentChat = rooms.find((room) => {
    return room._id === id;
  });

  isAdmin = currentChat.admin.find((user) => user.username === username);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id={id}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        {isAdmin && currentChat ? (
          <AdminGroupOptions
            currentChat={currentChat}
            setAnchorEl={setAnchorEl}
          />
        ) : (
          <MemberGroupOptions
            currentChat={currentChat}
            setAnchorEl={setAnchorEl}
          />
        )}
      </Menu>
    </>
  );
};

export default GroupMenu;
