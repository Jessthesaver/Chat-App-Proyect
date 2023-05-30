import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import CommonButton from "../../common/CommonButton/CommonButton";
import { useDispatch, useSelector } from "react-redux";
import { MuiChipsInput } from "mui-chips-input";
import { useTranslation } from "react-i18next";

function AddMember({ currentChat, setOpen }) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { friendsList, rooms } = useSelector((state) => state.user.value);

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
    const alreadyFriend = friendsList.find(({ username }) => username === chip);

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
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1,
        }}>
        <Typography textAlign="center">&#8288;{t("addMember")}</Typography>
        <Typography textAlign="center">&#8288;{t("fillForm")}</Typography>
        <Grid
          item
          sx={{
            width: "70%",
            alignSelf: "center",
          }}>
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
        </Grid>
        <Grid
          item
          display="flex"
          p={1}
          sx={{
            gap: "30px",
            justifyContent: "center",
          }}>
          <Button type="submit" variant="contained">
            {t("add")}
          </Button>
          <CommonButton
            variant="outlined"
            onClick={(event) => {
              event.preventDefault();
              return setOpen(false);
            }}>
            {t("cancel")}
          </CommonButton>
        </Grid>
      </Grid>
    </>
  );
}

export default AddMember;
