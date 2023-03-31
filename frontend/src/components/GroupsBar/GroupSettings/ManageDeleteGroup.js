import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Box, Button, MenuItem, Modal, Typography } from "@mui/material";
import CommonButton from "../../common/CommonButton/CommonButton";
import { contactStyles } from "../../ContactsBar/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ManageDeleteGroup = ({ currentChat }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { _id } = currentChat;

  const { username } = useSelector((state) => state.user.value);

  const [open, setOpen] = useState(false);

  const handleLeave = (event) => {
    event.preventDefault();

    const roomInput = {
      _id,
      members: {
        username,
      },
    };

    dispatch({
      type: "deleteGroup",
      payload: { roomInput },
    });

    navigate(`/`);

    return setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>
        <Typography>{t("deleteGroup")}</Typography>
      </MenuItem>

      <Modal open={open}>
        <Box sx={contactStyles.wrapper}>
          <Typography variant={"subtitle1"} gutterBottom>
            {t("deleteGroupQues")}
          </Typography>
          <Box sx={contactStyles.buttons}>
            <Button variant="contained" onClick={handleLeave}>
              {t("delete")}
            </Button>
            <CommonButton
              variant="outlined"
              onClick={(event) => {
                event.preventDefault();
                return setOpen(false);
              }}>
              {t("cancel")}
            </CommonButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ManageDeleteGroup;
