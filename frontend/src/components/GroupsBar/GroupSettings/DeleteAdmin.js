import { Box, Button, Typography } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CommonButton from "../../common/CommonButton/CommonButton";

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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1,
        }}>
        <Typography sx={{ textAlign: "center" }}>
          &#8288;{t("removeAdmin")}
        </Typography>
        <Typography sx={{ textAlign: "center" }}>
          &#8288;{t("fillForm")}
        </Typography>

        <Box
          sx={{
            width: "70%",
            alignSelf: "center",
          }}>
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
        </Box>
      </Box>
    </>
  );
};

export default DeleteAdmin;
