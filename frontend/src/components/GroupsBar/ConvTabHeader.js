import { navbarStyles } from "../Navbar/styles";
import CommonButton from "../common/CommonButton/CommonButton";
import SearchBar from "../common/SearchBar/SearchBar";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { contactStyles } from "../ContactsBar/styles";
import TagInput from "./TagInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ConvTabHeader = ({ open, setOpen, filterData }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { username } = useSelector((state) => {
    return state.user.value;
  });

  const [groupName, setGroupName] = useState(null);
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState(null);

  const handleSearch = (value) => {
    filterData(value);
  };

  const createConversation = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setGroupName(event.target.value);
  };

  const handleBlur = (event) => {
    event.preventDefault();

    if (event.target.value.trim() === "" || !event.target.value) {
      setErrors(t("addFriendError2"));
    } else {
      setErrors(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (groupName && groupName.trim() !== "") {
      const membersArray = members.map((member) => {
        return { username: member };
      });

      const createRoomReq = {
        roomInput: {
          name: groupName,
          admin: [{ username }],
          groupalChat: true,
          members: [...membersArray, { username }],
        },
      };

      dispatch({
        type: "createGroup",
        payload: createRoomReq,
      });

      setMembers([]);
      setGroupName(null);
      setErrors(null);

      setOpen(false);
    } else if (!groupName || groupName.trim() === "") {
      setErrors(t("addFriendError2"));
    }
  };

  return (
    <Box
      component="span"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 0,
        mr: 2,
        width: "100%",
        height: "100px",
      }}>
      <Box>
        <SearchBar
          placeholder={t("searchConversation")}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </Box>

      <Box
        m={1}
        sx={{
          width: "65px",
        }}>
        <CommonButton
          variant="contained"
          size="large"
          onClick={createConversation}
          sx={navbarStyles.addUserButton}>
          {t("add")}
        </CommonButton>
      </Box>

      <Modal open={open} onSubmit={handleSubmit}>
        <Box component="form" sx={contactStyles.wrapper}>
          <Typography variant="h6" component="h2">
            {t("newGroup")}
          </Typography>
          <Typography sx={{ mt: 2 }}>{t("fillForm")}</Typography>
          <Box sx={contactStyles.inputFields}>
            <TextField
              placeholder={t("groupName")}
              name="groupName"
              label={t("groupName")}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors ? true : false}
              helperText={
                errors ? errors : groupName ? `${groupName?.length}/25` : `0/25`
              }
              inputProps={{ maxLength: 25 }}
            />
            <TagInput
              name="members"
              members={members}
              setMembers={setMembers}
            />
          </Box>
          <Box sx={contactStyles.buttons}>
            <Button type="submit" variant="contained">
              {t("submit")}
            </Button>
            <CommonButton
              variant="outlined"
              onClick={(event) => {
                event.preventDefault();
                setMembers([]);
                setGroupName(null);
                setErrors(null);

                return setOpen(false);
              }}>
              {t("cancel")}
            </CommonButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ConvTabHeader;
