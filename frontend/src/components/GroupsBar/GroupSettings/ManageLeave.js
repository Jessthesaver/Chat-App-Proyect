import { Box, Button, MenuItem, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { contactStyles } from "../../ContactsBar/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ManageLeave = ({ currentChat }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { _id, admin } = currentChat;

  const { username } = useSelector((state) => state.user.value);

  const [open, setOpen] = useState(false);

  const handleLeave = () => {
    let roomInput;
    const isAdmin = admin.includes(username);

    if (isAdmin) {
      roomInput = {
        _id,
        admin: [{ username }],
        members: [{ username }],
      };
    } else if (!isAdmin) {
      roomInput = {
        _id,
        admin: null,
        members: [{ username }],
      };
    }
    dispatch({
      type: "leaveGroup",
      payload: { roomInput },
    });

    navigate(`/`);
    return setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>
        &#8288;
        <Typography>{t("leaveGroup")}</Typography>
      </MenuItem>

      <Modal open={open}>
        <Box sx={contactStyles.wrapper} component="form" onSubmit={handleLeave}>
          <Typography variant={"subtitle1"} gutterBottom>
            {t("leaveGroupQues")}
          </Typography>
          <Box sx={contactStyles.buttons}>
            <Button key={_id} type="submit" variant="contained">
              {t("leave")}
            </Button>
            <Button
              variant="outlined"
              onClick={(event) => {
                event.preventDefault();
                return setOpen(false);
              }}>
              {t("cancel")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ManageLeave;
