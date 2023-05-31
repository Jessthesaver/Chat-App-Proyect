import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MuiChipsInput } from "mui-chips-input";
import { useTranslation } from "react-i18next";
import { groupSettingsStyles } from "./styles";

const DeleteMember = ({ currentChat, setOpen }) => {
  const { t } = useTranslation();

  const { _id, members } = currentChat;

  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.user.value);

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
      <Grid
        container
        component="form"
        onSubmit={handleSubmit}
        pt={6}
        sx={groupSettingsStyles.gridContainer}>
        <Typography sx={{ textAlign: "center" }}>
          {t("removeMember")}
        </Typography>
        <Typography sx={{ textAlign: "center" }}>{t("fillForm")}</Typography>
        <Grid item sx={groupSettingsStyles.chipField}>
          <MuiChipsInput
            name="deleteMembers"
            value={chips}
            label={t("members")}
            placeholder={t("typeUsername")}
            helperText={chips.length > 0 ? t("doubleClick") : ""}
            onChange={handleChange}
            validate={handleValidation}
            clearInputOnBlur
            inputProps={{
              maxLength: 25,
            }}
            sx={groupSettingsStyles.MuiChips}
          />
        </Grid>
        <Grid item p={1} sx={groupSettingsStyles.modalButtons}>
          <Button type="submit" variant="contained">
            {t("delete")}
          </Button>
          <Button
            variant="outlined"
            onClick={(event) => {
              event.preventDefault();
              return setOpen(false);
            }}>
            {t("cancel")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default DeleteMember;
