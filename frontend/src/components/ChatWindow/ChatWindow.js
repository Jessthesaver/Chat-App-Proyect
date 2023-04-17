import { Grid } from "@mui/material";
import ComposeArea from "./ComposeArea";
import Messages from "./Messages";
import { useSubscription } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import MESSAGES_SUBSCRIPTION from "../../graphql/subscriptions/messagesgql.js";

const ChatWindow = () => {
  const { chatId } = useParams();

  const dispatch = useDispatch();

  const { currentConversation } = useSelector((state) => state.messages);

  useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId },
    onData: ({ data }) => {
      dispatch({
        type: "addNewMessage",
        payload: data?.data.newMessage,
      });
    },
  });

  useEffect(() => {
    dispatch({
      type: "queryMessages",
      payload: { _id: chatId },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation]);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: 0,
        height: "100%",
        width: "100%",
      }}>
      <Grid
        item
        sx={{
          overflowY: "scroll",
          scrollBehavior: "smooth",
          height: "100%",
          width: "100%",
          "& .css-tazwbd-MuiList-root::-webkit-scrollbar-track": {
            border: "none",
          },
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(140, 140, 140, 0.91)",
            borderRadius: "20px",
            outline: "1px solid slategrey",
          },
        }}>
        <Messages />
      </Grid>

      <Grid
        item
        sx={{
          padding: "2px",
          width: "100%",
          height: "100px",
        }}>
        <ComposeArea />
      </Grid>
    </Grid>
  );
};

export default ChatWindow;
