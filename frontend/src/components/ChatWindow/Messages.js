import { Box, List, Toolbar } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageItem from "./MessageItem";

const Messages = () => {
  const { currentConversation, value: messages } = useSelector(
    (state) => state.messages
  );
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages && currentConversation?._id) {
    const filteredMessages = messages.filter(
      (item) => item.chatId === currentConversation._id
    );
    return (
      <List
        disablePadding
        sx={{
          display: "flex",
          flexDirection: "column",
        }}>
        <Toolbar />

        {filteredMessages.map((message, index) => {
          return <MessageItem message={message} key={index} />;
        })}

        <Box ref={messagesEnd}></Box>
      </List>
    );
  }
};

export default Messages;
