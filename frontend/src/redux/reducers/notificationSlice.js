import { createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";

const initialState = {
  error: null,
  severity: null,
  existence: null,
  requestAccepted: null,
};

const notificationSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setNotification: (state = null, action) => {
      state.error = action.payload.error;
      state.severity = action.payload.severity;
    },
    deleteNotification: (state = null, action) => {
      state.error = action.payload.error;
      state.severity = action.payload.error;
    },
    setExistence: (state = null, action) => {
      state.existence = action.payload;
    },
    setDefaultNotification: (state = null, action) => {
      state.error = t("defaultError");
      state.severity = "error";
    },
  },
});

export const {
  setNotification,
  deleteNotification,
  setExistence,
  setDefaultNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
