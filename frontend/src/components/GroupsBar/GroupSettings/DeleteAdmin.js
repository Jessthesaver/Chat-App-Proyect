import { Button, Grid, Typography } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { groupSettingsStyles } from "./styles";

const DeleteAdmin = ({ currentChat, setOpen }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { _id, members, admin } = currentChat;
  const [chips, setChips] = useState([]);

  const handleChange = (newChips) => {
    if (newChips.length < 30) {
      setChips(newChips);
    }
  };

  const handleValidation = (chip) => {
    let isValid = true;
    const match = members.map((user) => {
      if (user.username.includes(chip)) return user;
    });

    const isValidMember = match.find((item) => item !== undefined);

    if (!isValidMember || admin.length - chips.length < 1) {
      isValid = false;
    }

    return {
      isError: !isValid,
      textError: `${chip} ${t("deleteAdminError")}`,
    };
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const admin = chips.map((user) => {
      return { username: user };
    });

    const roomInput = {
      _id,
      admin,
    };

    dispatch({
      type: "deleteAdmin",
      payload: { roomInput },
    });

    setOpen(false);
    setChips([]);
  };

  return (
    <>
      <Grid
        container
        component="form"
        onSubmit={handleSubmit}
        pt={6}
        sx={groupSettingsStyles.gridContainer}>
        <Typography sx={{ textAlign: "center" }}>{t("removeAdmin")}</Typography>
        <Typography sx={{ textAlign: "center" }}>{t("fillForm")}</Typography>

        <Grid item sx={groupSettingsStyles.chipField}>
          <MuiChipsInput
            name="deleteAdmin"
            value={chips}
            label={t("removeAdmin")}
            placeholder={t("typeUsername")}
            helperText={chips.length > 0 ? t("doubleClickHelp") : ""}
            onChange={handleChange}
            validate={handleValidation}
            clearInputOnBlur
            inputProps={{
              maxLength: 25,
            }}
            sx={groupSettingsStyles.MuiChips}
          />
        </Grid>

        <Grid item display="flex" p={1} sx={groupSettingsStyles.modalButtons}>
          <Button type="submit" variant="contained">
            {t("add")}
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

export default DeleteAdmin;
