import * as React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Tabs,
  Tab,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  Modal,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteMember from "./DeleteMember";
import AddMember from "./AddMember";
import { useTranslation } from "react-i18next";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 0, m: 0 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function ManageMembers({ currentChat }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>
        <Typography>{t("manageMembers")}</Typography>
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
          }}
          rowSpacing={0}>
          <Grid
            item
            xs={12}
            sx={{
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
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example">
                <Tab label={t("addMember")} {...a11yProps(0)} />
                <Tab label={t("removeMember")} {...a11yProps(1)} />
              </Tabs>
            </AppBar>

            <TabPanel value={value} index={0} dir={theme.direction}>
              <AddMember
                currentChat={currentChat}
                open={open}
                setOpen={setOpen}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <DeleteMember
                currentChat={currentChat}
                open={open}
                setOpen={setOpen}
              />
            </TabPanel>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
}
