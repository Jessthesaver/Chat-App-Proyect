import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import CommonButton from "../../common/CommonButton/CommonButton";
import { useDispatch, useSelector } from "react-redux";
import { MuiChipsInput } from "mui-chips-input";
import { useTranslation } from "react-i18next";

const DeleteMember = ({ currentChat, setOpen }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { _id, members } = currentChat;

  const { username } = useSelector((state) => state.user.value);

  // const [error, setError] = useState();
  const [chips, setChips] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const members = chips.map((user) => {
      return { username: user };
    });

    const roomInput = {
      _id,
      members,
    };

    dispatch({
      type: "deleteMember",
      payload: { roomInput },
    });

    setOpen(false);
    setChips([]);
  };

  const handleChange = (newChips) => {
    if (newChips.length < 30) {
      setChips(newChips);
    }
  };

  const handleValidation = (chip) => {
    const isValid = members.find(
      (user) => user.username === chip && user.username !== username
    );
    return {
      isError: !isValid,
      textError: t("deleteYourself"),
    };
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1,
        }}>
        <Typography sx={{ textAlign: "center" }}>
          {t("removeMember")}
        </Typography>
        <Typography sx={{ textAlign: "center" }}>{t("fillForm")}</Typography>
        <Box
          sx={{
            width: "70%",
            alignSelf: "center",
          }}>
          <MuiChipsInput
            name="deleteMembers"
            value={chips}
            label={t("members")}
            placeholder={t("typeUsername")}
            helperText={chips.length > 0 ? t("doubleClickHelp") : ""}
            onChange={handleChange}
            validate={handleValidation}
            clearInputOnBlur
            inputProps={{
              maxLength: 25,
            }}
            sx={{
              width: "100%",
              "& .MuiChipsInput-Chip": {
                backgroundColor: "rgba(175, 173, 222, 0.8)",
              },
              "& .MuiChipsInput-Chip-Editing": {
                color: "white",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            justifyContent: "center",
            padding: 1,
          }}>
          <Button type="submit" variant="contained">
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
    </>
  );
};

export default DeleteMember;
