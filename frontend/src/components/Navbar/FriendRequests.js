import {
  Badge,
  Grid,
  IconButton,
  List,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import RequestItem from "./RequestItem";

const FriendRequests = () => {
  const { t } = useTranslation();

  const { requests } = useSelector((state) => state.user.value);

  const [open, setOpen] = useState(false);

  return (
    <>
      <MenuItem
        onClick={() => {
          setOpen(true);
        }}>
        &#8288;
        <Badge badgeContent={requests.length} color="secondary">
          {t("friendRequest")}
        </Badge>
      </MenuItem>

      <Modal open={open}>
        <Grid
          container
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 0,
          }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              margin: 0,
              padding: 0,
              justifyContent: "right",
              height: "auto",
              backgroundColor: "rgba(120, 120, 120, 1.0)",
            }}>
            <IconButton
              size="medium"
              onClick={() => setOpen(false)}
              sx={{
                color: "white",
              }}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}>
              {t("friendRequest")}
            </Typography>

            <List
              sx={{
                width: "100%",
                height: "400px",
                overflowY: "scroll",
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
                  backgroundColor: "rgba(145, 136, 153, 0.91)",
                  borderRadius: "20px",

                  outline: "1px solid slategrey",
                },
              }}>
              {requests.map((item) => (
                <RequestItem item={item} key={item.from} />
              ))}
            </List>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default FriendRequests;
