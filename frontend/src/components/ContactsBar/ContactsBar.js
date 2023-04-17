import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabHeader from "./TabHeader";
import TabContent from "./TabContent";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@apollo/client";
import { FRIEND_REQUEST_ACCEPTED } from "../../graphql/subscriptions/requestAccepted.js";

const ContactsBar = () => {
  const { t } = useTranslation();

  const { username, friendsList } = useSelector((state) => {
    return state.user.value;
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(friendsList);
  const [users, setUsers] = useState(null);

  const dispatch = useDispatch();

  useSubscription(FRIEND_REQUEST_ACCEPTED, {
    onData: ({ data }) => {
      if (data?.data.friendRequestAccepted.username === username) {
        dispatch({
          type: "requestAccepted",
          payload: data?.data.friendRequestAccepted,
        });
      }
    },
  });

  const filterData = (value) => {
    const lowerdCaseValue = value.toLowerCase().trim();

    if (lowerdCaseValue === "") setUsers(search);
    else {
      const filteredData = search.filter((item) => {
        const { username } = item;

        const output = username.toLowerCase().trim().includes(lowerdCaseValue);

        return output;
      });

      setUsers(filteredData);
    }
  };

  if (friendsList.length > 0 && friendsList && username) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin: 0,
          padding: 0,
        }}>
        <TabHeader open={open} setOpen={setOpen} filterData={filterData} />

        <TabContent users={users} />
      </Box>
    );
  } else if (friendsList.length === 0) {
    return (
      <Box>
        <TabHeader open={open} setOpen={setOpen} />

        <Typography>{t("noContacts")}</Typography>
      </Box>
    );
  }
};

export default ContactsBar;
