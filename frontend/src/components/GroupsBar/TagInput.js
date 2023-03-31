import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { contactStyles } from "../ContactsBar/styles";

const TagInput = ({ members, setMembers }) => {
  const { t } = useTranslation();

  const { friendsList } = useSelector((state) => state.user.value);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMembers(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <FormControl
        sx={contactStyles.inputFields}
        // sx={{ mt: 2, width: { xs: 150, sm: 300 } }}
      >
        <InputLabel>{t("members")}</InputLabel>
        <Select
          multiple
          value={members}
          onChange={handleChange}
          input={<OutlinedInput label={t("members")} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} color="primary" />
              ))}
            </Box>
          )}>
          {friendsList.map((item) => (
            <MenuItem key={item.username} value={item.username}>
              {item.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TagInput;
