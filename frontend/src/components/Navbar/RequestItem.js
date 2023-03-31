import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import { useDispatch, useSelector } from "react-redux";

const RequestItem = ({ item }) => {
  const { from } = item;

  const dispatch = useDispatch();

  const { username } = useSelector((state) => state.user.value);

  const addContact = (event) => {
    event.preventDefault();

    const friendReq = {
      friendInput: {
        userB: [{ username: item.from.username }],
      },
    };

    dispatch({
      type: "acceptContact",
      payload: friendReq,
    });
  };

  const rejectContact = (event) => {
    event.preventDefault();

    const friendReq = {
      friendInput: {
        userB: [{ username: item.from.username }],
      },
    };

    dispatch({
      type: "rejectFriend",
      payload: friendReq,
    });
  };

  return (
    <Box>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={from.avatar} />
        </ListItemAvatar>
        <ListItemText primary={`${from.name}`} secondary={from.username} />

        <IconButton color="success" size="large" onClick={addContact}>
          <CheckCircleIcon />
        </IconButton>

        <IconButton color="error" size="large" onClick={rejectContact}>
          <DoDisturbOnIcon />
        </IconButton>
      </ListItem>
      <Divider />
    </Box>
  );
};

export default RequestItem;
