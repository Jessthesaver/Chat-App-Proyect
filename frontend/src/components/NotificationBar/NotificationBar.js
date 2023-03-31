import { Alert, Zoom } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const NotificationBar = () => {
  const dispatch = useDispatch();

  const { notification } = useSelector((state) => state);

  const handleClose = (event) => {
    event.preventDefault();
    const cleanNotification = {
      error: null,
      severity: null,
    };

    dispatch({
      type: "cleanNotification",
      payload: cleanNotification,
    });
  };

  return (
    <Zoom in={Boolean(notification.error)}>
      <Alert
        severity={notification.severity ? notification.severity : "warning"}
        onClose={handleClose}
        sx={{
          position: "absolute",
          top: "0%",
          left: "60%",
          width: "40%",
          boxSizing: "border-box",
          zIndex: 999,
        }}>
        {notification.error}
      </Alert>
    </Zoom>
  );
};

export default NotificationBar;
