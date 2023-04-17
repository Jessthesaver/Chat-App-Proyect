import { useSubscription } from "@apollo/client";
import { Typography } from "@mui/material";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContactList from "./ContactList";
import CONTACT_DELETED from "../../graphql/subscriptions/deleteContact.js";

const TabContent = ({ users }) => {
  const navigate = useNavigate();

  const { username, friendsList } = useSelector((state) => state.user.value);

  const dispatch = useDispatch();

  useSubscription(CONTACT_DELETED, {
    onData: ({ data }) => {
      if (data?.data.deleteContact.username === username) {
        dispatch({
          type: "deletedFromContact",
          payload: data?.data.deleteContact,
        });

        navigate("/");
      }
    },
  });

  if (!users) {
    return <ContactList contacts={friendsList} />;
  } else if (users.length === 0) {
    return <Typography>{t("noCoincidence")}</Typography>;
  } else {
    return <ContactList contacts={users} />;
  }
};

export default TabContent;
