import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { contactStyles } from "../ContactsBar/styles";

const LanguageSettings = ({ setOpen }) => {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();

  const { username } = useSelector((state) => state.user.value);

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleChange = (event) => {
    event.preventDefault();
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    i18n.changeLanguage(selectedLanguage);

    const userInput = {
      username,
      settingsInput: {
        language: selectedLanguage,
      },
    };
    dispatch({
      type: "setLanguage",
      payload: userInput,
    });
    setOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 1,
      }}>
      <Typography sx={{ textAlign: "center" }}>
        {t("preferredLanguage")}
      </Typography>
      <FormControl
        sx={{
          margin: 1,
        }}>
        <InputLabel>{t("language")}</InputLabel>
        <Select
          label="Language"
          value={selectedLanguage}
          onChange={handleChange}>
          <MenuItem value={"en"}>{t("english")}</MenuItem>
          <MenuItem value={"es"}>{t("spanish")}</MenuItem>
          <MenuItem value={"fr"}>{t("french")}</MenuItem>
          <MenuItem value={"gr"}>{t("german")}</MenuItem>
        </Select>
      </FormControl>
      <Box sx={contactStyles.buttons}>
        <Button variant="contained" type="submit">
          {t("apply")}
        </Button>
      </Box>
    </Box>
  );
};

export default LanguageSettings;
