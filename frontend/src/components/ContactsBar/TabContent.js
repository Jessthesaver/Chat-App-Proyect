import { gql, useSubscription } from "@apollo/client";
import { Typography } from "@mui/material";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContactList from "./ContactList";

const CONTACT_DELETED = gql`
  subscription deleteContact {
    deleteContact {
      username
      name
      email
      avatar
      friendsList {
        username
        name
        email
        avatar
      }
      requests {
        from {
          username
          name
          email
          avatar
        }
        to {
          username
          name
          email
          avatar
        }
      }
      rooms {
        _id
        name
        groupalChat
        admin {
          username
        }
        members {
          username
          name
          email
          joinedAt
          avatar
        }
      }
      token
      settings {
        language
      }
    }
  }
`;

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
