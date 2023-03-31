import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import GestureIcon from "@mui/icons-material/Gesture";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { contactStyles } from "../ContactsBar/styles";
import CommonButton from "../common/CommonButton/CommonButton";
import Canvas from "./Canvas";
import { useTranslation } from "react-i18next";

const ComposeArea = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const { chatId } = useParams();

  useEffect(() => {
    setMessage("");
  }, [chatId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.length > 0) {
      const messageInput = {
        chatId,
        content: message,
        isScribble: false,
      };

      dispatch({
        type: "createMessage",
        payload: messageInput,
      });

      setMessage("");
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const text = event.target.value;

    setMessage(text);
  };

  const handleClick = (event) => {
    event.preventDefault();

    setOpen(true);
  };

  const handleScribble = (event) => {
    event.preventDefault();
    const canva = document.querySelector("canvas");

    const image = canva.toDataURL("image/png").toString();

    const messageInput = {
      chatId,
      content: image,
      isScribble: true,
    };

    if (image.length < 92000) {
      dispatch({
        type: "createScribble",
        payload: messageInput,
      });
      setError(false);
      setOpen(false);
    } else {
      const ctx = canva.getContext("2d");
      ctx.clearRect(0, 0, 600, 400);
      setError(true);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          width: "100%",
          height: "97%",
          padding: "0px",
          gap: "15px",
          alignItems: "center",
        }}>
        <TextField
          direction="column"
          placeholder={t("typeMessage")}
          value={message}
          onChange={handleChange}
          inputProps={{
            maxLength: 5000,
          }}
          required
          sx={{
            backgroundColor: "rgb(50, 50, 50)",
            borderRadius: "25px",
            flexGrow: 2,
            paddingLeft: "2px",
            width: "125vh",
            maxHeight: "70px",
            margin: 0,
            whiteSpace: "normal",
            overflowY: "scroll",
            overflowWrap: "break-word",
            "& fieldset": {
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
              backgroundColor: "rgba(145, 136, 153, 0.91)",
              outline: "1px solid slategrey",
            },
          }}
        />
        <IconButton
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{
            minWidth: "50px",
            width: "50px",
            height: "50px",
            flexGrow: 0,
            backgroundColor: "rgb(50, 50, 50)",
          }}>
          <GestureIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            minWidth: "50px",
            width: "50px",
            height: "50px",
            flexGrow: 0,
            backgroundColor: "rgb(50, 50, 50)",
          }}>
          <SendIcon />
        </IconButton>
      </Box>

      <Modal open={open} onSubmit={handleScribble}>
        <Box component="form" sx={contactStyles.scribble}>
          <Typography variant="h6" component="h2">
            {t("scribble")}
          </Typography>
          <Typography sx={{ mt: 1 }}>{t("scribbleInstruction")}</Typography>

          <Box
            sx={{
              margin: 1,
            }}>
            <Canvas width={430} height={280} id="canvas" />
            {error ? (
              <Typography color="red" sx={{ m: 1, textAlign: "center" }}>
                {t("scribbleError")}
              </Typography>
            ) : null}
          </Box>

          <Box sx={contactStyles.buttons}>
            <Button type="submit" variant="contained">
              {t("submit")}
            </Button>
            <CommonButton
              variant="outlined"
              onClick={(event) => {
                event.preventDefault();
                setError(false);
                return setOpen(false);
              }}>
              {t("cancel")}
            </CommonButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ComposeArea;
