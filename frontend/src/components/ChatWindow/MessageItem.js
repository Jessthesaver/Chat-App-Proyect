import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useSelector } from "react-redux";

const MessageItem = ({ message }) => {
  const { username } = useSelector((state) => state.user.value);

  const color =
    message.sendBy === username
      ? "rgba(175, 225, 175, 0.8)"
      : "rgba(200, 210, 200, 0.8)";
  const alignMessage = message.sendBy === username ? "flex-end" : "flex-start";

  const time = new Date(message.createdAt);

  return (
    <Box
      sx={{
        maxWidth: "60%",
        alignSelf: alignMessage,
      }}>
      <ListItem
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 1,
          alignItems: "stretch",
          overflowWrap: "break-word",
          borderRadius: "10px",
        }}>
        {!message.isScribble ? (
          <>
            <ListItemText
              primary={message.sendBy}
              secondary={message.content}
              sx={{
                backgroundColor: color,
                borderRadius: "10px",
                padding: 1,
                margin: 0,
                height: "auto",
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "30px", sm: "25px", md: "15px" },
                  fontWeight: "bold",
                },
                "& .MuiListItemText-secondary": {
                  fontSize: { xs: "30px", sm: "25px", md: "15px" },
                  color: "rgba(14, 14, 14, 1)",
                },
              }}
            />
            <ListItemText
              secondary={
                message?.createdAt
                  ? `${time.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : `${new Date(Date.now()).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
              }
              sx={{
                padding: 0,
                margin: 0,
                width: "100%",
                textAlign: "right",
              }}
            />
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: color,
                width: "100%",
                borderRadius: "10px",
                margin: 1,
                padding: 1,
              }}>
              <ListItemText
                primary={message.sendBy}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                  },
                  "& .MuiListItemText-secondary": {
                    color: "rgba(14, 14, 14, 1)",
                  },
                }}
              />
              <ListItemIcon
                sx={{
                  width: "450px",
                  height: "300px",
                  borderRadius: "3px",
                  backgroundColor: "whitesmoke",
                }}>
                <img alt="" src={message.content} />
              </ListItemIcon>
            </Box>

            <ListItemText
              secondary={
                message?.createdAt
                  ? `${time.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : `${new Date(Date.now()).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
              }
              sx={{
                padding: 0,
                margin: 0,
                width: "100%",
                textAlign: "right",
              }}
            />
          </>
        )}
      </ListItem>
    </Box>
  );
};

export default MessageItem;
