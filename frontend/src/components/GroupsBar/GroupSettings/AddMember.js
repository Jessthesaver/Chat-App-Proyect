import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MuiChipsInput } from "mui-chips-input";
import { useTranslation } from "react-i18next";
import { groupSettingsStyles } from "./styles";

const AddMember = ({ currentChat, setOpen }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { contactList, rooms } = useSelector((state) => state.user.value);

  const { _id } = currentChat;
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
      type: "addMember",
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
    const alreadyFriend = contactList.find(({ username }) => username === chip);

    const alreadyMember = rooms.reduce((acc, { _id, members }) => {
      if (_id === currentChat._id) {
        const inGroup = members.find(({ username }) => username === chip);
        if (inGroup) {
          acc = inGroup;
          return acc;
        }
      }
    });

    return {
      isError: !alreadyFriend ? !alreadyFriend : alreadyMember,
      textError: !alreadyFriend ? t("addMemberError1") : t("addMemberError2"),
    };
  };

  return (
    <>
      <Grid
        container
        component="form"
        onSubmit={handleSubmit}
        pt={6}
        flexBasis="column"
        sx={groupSettingsStyles.gridContainer}>
        <Typography textAlign="center">{t("addMember")}</Typography>
        <Typography textAlign="center">{t("fillForm")}</Typography>
        <Grid item sx={groupSettingsStyles.chipField}>
          <MuiChipsInput
            name="addMembers"
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

export default AddMember;
