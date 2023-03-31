import { put } from "redux-saga/effects";
import { deleteNotification } from "./../reducers/notificationSlice.js";

function* removeNotification(action) {
    yield put(deleteNotification(action.payload));
};

export default removeNotification;